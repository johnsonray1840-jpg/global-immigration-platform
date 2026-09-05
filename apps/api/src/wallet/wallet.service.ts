import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getWallet(userId: string) {
    return this.prisma.wallet.upsert({
      where: { userId },
      create: { userId, balance: 0, currency: 'USD' },
      update: {},
    });
  }

  async getTransactionHistory(userId: string) {
    const wallet = await this.getWallet(userId);
    return this.prisma.walletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async requestDeposit(
    userId: string,
    amount: number,
    paymentMethodType: string,
    promoCode?: string,
  ) {
    if (!amount || amount <= 0) throw new BadRequestException('Amount must be positive');

    let finalAmount = amount;
    let discount = 0;
    if (promoCode) {
      const promo = await this.prisma.promotion.findUnique({
        where: { code: promoCode },
      });
      if (
        promo &&
        promo.isActive &&
        (!promo.validUntil || promo.validUntil > new Date())
      ) {
        discount = amount * (promo.discountPct / 100);
        finalAmount = amount - discount;
      }
    }

    // Find payment method by type; fallback to first active crypto method
    let method = await this.prisma.paymentMethod.findFirst({
      where: { type: paymentMethodType as any, isActive: true },
    });
    if (!method) {
      method = await this.prisma.paymentMethod.findFirst({
        where: { type: 'CRYPTO', isActive: true },
      });
    }
    if (!method) throw new BadRequestException('No payment method available');

    const invoice = await this.prisma.invoice.create({
      data: {
        userId,
        amount: finalAmount,
        currency: 'USD',
        status: 'PENDING_APPROVAL',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        walletDeposit: true,
        promoCode: promoCode || null,
        breakdownJson: { originalAmount: amount, discount, finalAmount },
      },
    });

    const existingApproval = await this.prisma.paymentApproval.findUnique({
      where: { invoiceId: invoice.id },
    });

    let approval;
    if (existingApproval) {
      approval = await this.prisma.paymentApproval.update({
        where: { id: existingApproval.id },
        data: {
          status: 'PENDING',
          requestedById: userId,
          paymentMethodId: method.id,
        },
      });
    } else {
      approval = await this.prisma.paymentApproval.create({
        data: {
          invoiceId: invoice.id,
          requestedById: userId,
          status: 'PENDING',
          paymentMethodId: method.id,
        },
      });
    }

    return { invoice, approval };
  }
}