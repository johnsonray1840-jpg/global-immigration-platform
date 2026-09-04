import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { EventsGateway } from '../real-time/events.gateway';
import { PaymentRequestStatus, PaymentMethodEnum } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private mailService: MailService,
    private eventsGateway: EventsGateway,
    private notificationsService: NotificationsService,
  ) {}

  // ------------------------------------------------------------
  // Helper: Get actual payment method ID by type
  // ------------------------------------------------------------
  private async getPaymentMethodIdByType(
    type: string,
  ): Promise<string | null> {
    const method = await this.prisma.paymentMethod.findFirst({
      where: { type: type as any, isActive: true },
    });
    return method?.id || null;
  }

  // ------------------------------------------------------------
  // Public Endpoints
  // ------------------------------------------------------------

  async getPaymentMethods() {
    return this.prisma.paymentMethod.findMany();
  }

  async getActiveCryptoWallets() {
    return this.prisma.cryptoWallet.findMany({
      where: { isActive: true },
      select: {
        id: true,
        currency: true,
        address: true,
        isActive: true,
      },
    });
  }

  async createInvoice(
    userId: string,
    data: {
      packageId?: string;
      caseId?: string;
      amount?: number;
      breakdown?: any;
      promoCode?: string;
    },
  ) {
    let total = data.amount || 0;
    let breakdown = data.breakdown || {};

    if (data.packageId) {
      const pkg = await this.prisma.servicePackage.findUnique({
        where: { id: data.packageId },
      });
      if (!pkg) throw new NotFoundException('Package not found');
      total = pkg.serviceFee;
      breakdown = {
        packageName: pkg.name,
        serviceFee: pkg.serviceFee,
        governmentFee: 0,
        total: pkg.serviceFee,
      };

      if (data.caseId) {
        const caseData = await this.prisma.case.findUnique({
          where: { id: data.caseId },
          include: { visaRule: true },
        });
        if (caseData?.visaRule) {
          const govFee = caseData.visaRule.governmentFee || 0;
          breakdown.governmentFee = govFee;
          breakdown.total = pkg.serviceFee + govFee;
          total = breakdown.total;
        }
      }

      if (data.promoCode) {
        const promo = await this.applyPromoCode(data.promoCode);
        const discountAmount = total * (promo.discountPct / 100);
        total -= discountAmount;
        breakdown = {
          ...breakdown,
          promoCode: promo.code,
          discount: discountAmount,
          total,
        };
      }
    }

    const invoice = await this.prisma.invoice.create({
      data: {
        userId,
        packageId: data.packageId,
        caseId: data.caseId,
        amount: total,
        currency: 'USD',
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        breakdownJson: breakdown,
      },
    });
    return invoice;
  }

  async applyPromoCode(code: string) {
    const promo = await this.prisma.promotion.findUnique({
      where: { code },
    });
    if (
      !promo ||
      !promo.isActive ||
      (promo.validUntil && promo.validUntil < new Date())
    ) {
      throw new BadRequestException('Invalid or expired promo code');
    }
    return { code: promo.code, discountPct: promo.discountPct };
  }

  // ------------------------------------------------------------
  // Wire Transfer Details
  // ------------------------------------------------------------
  async getWireDetails(userId: string) {
    // 1. Explicit user assignment
    const assignment = await this.prisma.userWireAccount.findUnique({
      where: { userId },
    });
    if (assignment) {
      const account = await this.prisma.wireBankAccount.findUnique({
        where: { id: assignment.wireAccountId },
      });
      if (account) return account;
    }

    // 2. Country-based fallback
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    const countryCode =
      user?.profile?.nationality || user?.profile?.country || 'US';
    const country = await this.prisma.country.findFirst({
      where: { code: countryCode },
    });
    if (country) {
      const wireAccount = await this.prisma.wireBankAccount.findFirst({
        where: { countryId: country.id, isActive: true },
      });
      if (wireAccount) return wireAccount;
    }

    // 3. Ultimate fallback: Bank of America
    const defaultAccount = await this.prisma.wireBankAccount.findFirst({
      where: {
        bankName: { contains: 'Bank of America', mode: 'insensitive' },
        isActive: true,
      },
    });
    if (defaultAccount) return defaultAccount;

    throw new NotFoundException('No wire transfer account available');
  }

  // ------------------------------------------------------------
  // Crypto Payment Flow
  // ------------------------------------------------------------
  async initCryptoPayment(
    userId: string,
    invoiceId: string,
    currency: string,
    amount: number,
  ) {
    const wallet = await this.prisma.cryptoWallet.findFirst({
      where: { currency: currency as any, isActive: true },
    });
    if (!wallet) {
      throw new BadRequestException('No active wallet found for this currency');
    }

    const expiresAt = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes
    const session = await this.prisma.cryptoPaymentSession.create({
      data: {
        invoiceId,
        userId,
        currency: currency as any,
        walletAddress: wallet.address,
        amount,
        status: 'PENDING',
        confirmations: 0,
        expiresAt,
      },
    });
    return session;
  }

  async confirmCryptoPayment(sessionId: string) {
    const session = await this.prisma.cryptoPaymentSession.findUnique({
      where: { id: sessionId },
    });
    if (!session || session.status !== 'PENDING')
      throw new BadRequestException('Invalid session');

    const methodId = await this.getPaymentMethodIdByType('CRYPTO');
    if (!methodId)
      throw new BadRequestException('Crypto payment method not available');

    // Update session status
    const updatedSession = await this.prisma.cryptoPaymentSession.update({
      where: { id: sessionId },
      data: { confirmations: 5, status: 'CONFIRMED' },
    });

    // Idempotent approval
    const existingApproval = await this.prisma.paymentApproval.findUnique({
      where: { invoiceId: session.invoiceId },
    });

    let approval;
    if (existingApproval) {
      approval = await this.prisma.paymentApproval.update({
        where: { id: existingApproval.id },
        data: {
          status: 'PENDING',
          requestedById: session.userId,
          paymentMethodId: methodId,
        },
      });
    } else {
      approval = await this.prisma.paymentApproval.create({
        data: {
          invoiceId: session.invoiceId,
          requestedById: session.userId,
          status: 'PENDING',
          paymentMethodId: methodId,
        },
      });
    }

    await this.prisma.invoice.update({
      where: { id: session.invoiceId },
      data: { status: 'PENDING_APPROVAL' },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: session.userId },
    });
    if (user)
      await this.mailService.sendPaymentProcessing(
        user.email,
        session.invoiceId,
      );

    return { session: updatedSession, approval };
  }

  // ------------------------------------------------------------
  // PayPal Flow
  // ------------------------------------------------------------
  async initPayPalPayment(userId: string, invoiceId: string) {
    const methodId = await this.getPaymentMethodIdByType('PAYPAL');
    if (!methodId)
      throw new BadRequestException('PayPal payment method not available');

    const existingApproval = await this.prisma.paymentApproval.findUnique({
      where: { invoiceId },
    });

    let approval;
    if (existingApproval) {
      approval = await this.prisma.paymentApproval.update({
        where: { id: existingApproval.id },
        data: {
          status: 'PENDING',
          requestedById: userId,
          paymentMethodId: methodId,
        },
      });
    } else {
      approval = await this.prisma.paymentApproval.create({
        data: {
          invoiceId,
          requestedById: userId,
          status: 'PENDING',
          paymentMethodId: methodId,
        },
      });
    }

    await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'PENDING_APPROVAL' },
    });

    // No email here – email sent after user confirms via confirmPayPal
    return { redirectUrl: `https://paypal.com/checkout/${uuid()}`, approval };
  }

  async confirmPayPal(userId: string, invoiceId: string) {
    const existingApproval = await this.prisma.paymentApproval.findUnique({
      where: { invoiceId },
    });
    if (!existingApproval)
      throw new NotFoundException('No pending approval found');

    const updatedApproval = await this.prisma.paymentApproval.update({
      where: { id: existingApproval.id },
      data: { status: 'PENDING', requestedById: userId },
    });

    await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'PENDING_APPROVAL' },
    });

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user)
      await this.mailService.sendPaymentProcessing(user.email, invoiceId);

    return { approval: updatedApproval };
  }

  // ------------------------------------------------------------
  // Wire Transfer Flow
  // ------------------------------------------------------------
  async initiateWireTransfer(userId: string, invoiceId: string) {
    const methodId = await this.getPaymentMethodIdByType('BANK_TRANSFER');
    if (!methodId)
      throw new BadRequestException('Bank transfer method not available');

    const existingApproval = await this.prisma.paymentApproval.findUnique({
      where: { invoiceId },
    });

    let approval;
    if (existingApproval) {
      approval = await this.prisma.paymentApproval.update({
        where: { id: existingApproval.id },
        data: {
          status: 'PENDING',
          requestedById: userId,
          paymentMethodId: methodId,
        },
      });
    } else {
      approval = await this.prisma.paymentApproval.create({
        data: {
          invoiceId,
          requestedById: userId,
          status: 'PENDING',
          paymentMethodId: methodId,
        },
      });
    }

    await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'PENDING_APPROVAL' },
    });

    // No email here – email sent after user confirms via confirmWireTransfer
    return { approval };
  }

  async confirmWireTransfer(userId: string, invoiceId: string) {
    const existingApproval = await this.prisma.paymentApproval.findUnique({
      where: { invoiceId },
    });
    if (!existingApproval)
      throw new NotFoundException('No pending approval found');

    const updatedApproval = await this.prisma.paymentApproval.update({
      where: { id: existingApproval.id },
      data: { status: 'PENDING', requestedById: userId },
    });

    await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'PENDING_APPROVAL' },
    });

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user)
      await this.mailService.sendPaymentProcessing(user.email, invoiceId);

    return { approval: updatedApproval };
  }

  // ------------------------------------------------------------
  // Admin Review
  // ------------------------------------------------------------
  async reviewApproval(
    approvalId: string,
    status: string,
    reviewedById: string,
    reason?: string,
  ) {
    const approval = await this.prisma.paymentApproval.findUnique({
      where: { id: approvalId },
    });
    if (!approval) throw new NotFoundException('Approval not found');

    const updated = await this.prisma.paymentApproval.update({
      where: { id: approvalId },
      data: {
        status: status as PaymentRequestStatus,
        reviewedById,
        reason,
      },
    });

    const invoiceId = approval.invoiceId;
    if (status === 'CONFIRMED') {
      await this.prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: 'PAID' },
      });
      const invoice = await this.prisma.invoice.findUnique({
        where: { id: invoiceId },
      });
      if (!invoice) throw new NotFoundException('Invoice not found');

      if (invoice.walletDeposit) {
        const wallet = await this.prisma.wallet.upsert({
          where: { userId: invoice.userId },
          update: { balance: { increment: invoice.amount } },
          create: {
            userId: invoice.userId,
            balance: invoice.amount,
            currency: invoice.currency,
          },
        });
        await this.prisma.walletTransaction.create({
          data: {
            walletId: wallet.id,
            invoiceId: invoice.id,
            amount: invoice.amount,
            type: 'DEPOSIT',
            status: 'COMPLETED',
            method: PaymentMethodEnum.CRYPTO,
          },
        });

        const user = await this.prisma.user.findUnique({
          where: { id: invoice.userId },
        });
        if (user)
          await this.mailService.sendWalletDepositConfirmation(
            user.email,
            invoice.amount,
          );
      }

      const user = await this.prisma.user.findUnique({
        where: { id: invoice.userId },
      });
      if (user)
        await this.mailService.sendPaymentApproved(user.email, invoiceId);

      if (invoice.userId)
        this.eventsGateway.emitToUser(invoice.userId, 'payment-updated', {
          status: 'CONFIRMED',
        });
      await this.notificationsService.createNotification(
        invoice.userId,
        'Payment Approved',
        'Your payment has been confirmed by our Payment Verification Team.',
        { invoiceId },
      );
    } else if (status === 'DECLINED') {
      await this.prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: 'CANCELLED' },
      });
      const invoice = await this.prisma.invoice.findUnique({
        where: { id: invoiceId },
      });
      if (!invoice) throw new NotFoundException('Invoice not found');

      const user = await this.prisma.user.findUnique({
        where: { id: invoice.userId },
      });
      if (user)
        await this.mailService.sendPaymentDeclined(
          user.email,
          invoiceId,
          reason || 'Transaction failed',
        );

      if (invoice.userId)
        this.eventsGateway.emitToUser(invoice.userId, 'payment-updated', {
          status: 'DECLINED',
        });
      await this.notificationsService.createNotification(
        invoice.userId,
        'Payment Declined',
        'Your payment was unsuccessful. Reason: ' +
          (reason || 'Transaction failed'),
        { invoiceId },
      );
    }

    return updated;
  }

  async requestApproval(
    invoiceId: string,
    userId: string,
    paymentMethodType?: string,
  ) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');

    let methodId: string | null = null;
    if (paymentMethodType) {
      methodId = await this.getPaymentMethodIdByType(paymentMethodType);
      if (!methodId)
        throw new BadRequestException('Payment method not available');
    } else {
      // default to bank transfer
      methodId = await this.getPaymentMethodIdByType('BANK_TRANSFER');
      if (!methodId)
        throw new BadRequestException('Bank transfer method not available');
    }

    const existingApproval = await this.prisma.paymentApproval.findUnique({
      where: { invoiceId },
    });

    let approval;
    if (existingApproval) {
      approval = await this.prisma.paymentApproval.update({
        where: { id: existingApproval.id },
        data: {
          status: 'PENDING',
          requestedById: userId,
          paymentMethodId: methodId,
        },
      });
    } else {
      approval = await this.prisma.paymentApproval.create({
        data: {
          invoiceId,
          requestedById: userId,
          status: 'PENDING',
          paymentMethodId: methodId,
        },
      });
    }

    await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'PENDING_APPROVAL' },
    });

    // Email is sent when user later confirms (e.g., via confirmWireTransfer or confirmPayPal)
    return approval;
  }

  async getAllApprovals() {
    return this.prisma.paymentApproval.findMany({
      include: {
        invoice: { include: { user: true, package: true } },
        requestedBy: true,
        paymentMethod: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}