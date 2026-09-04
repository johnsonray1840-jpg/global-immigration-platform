"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const mail_service_1 = require("../mail/mail.service");
const events_gateway_1 = require("../real-time/events.gateway");
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const notifications_service_1 = require("../notifications/notifications.service");
let PaymentsService = class PaymentsService {
    prisma;
    configService;
    mailService;
    eventsGateway;
    notificationsService;
    constructor(prisma, configService, mailService, eventsGateway, notificationsService) {
        this.prisma = prisma;
        this.configService = configService;
        this.mailService = mailService;
        this.eventsGateway = eventsGateway;
        this.notificationsService = notificationsService;
    }
    async getPaymentMethodIdByType(type) {
        const method = await this.prisma.paymentMethod.findFirst({
            where: { type: type, isActive: true },
        });
        return method?.id || null;
    }
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
    async createInvoice(userId, data) {
        let total = data.amount || 0;
        let breakdown = data.breakdown || {};
        if (data.packageId) {
            const pkg = await this.prisma.servicePackage.findUnique({
                where: { id: data.packageId },
            });
            if (!pkg)
                throw new common_1.NotFoundException('Package not found');
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
    async applyPromoCode(code) {
        const promo = await this.prisma.promotion.findUnique({
            where: { code },
        });
        if (!promo ||
            !promo.isActive ||
            (promo.validUntil && promo.validUntil < new Date())) {
            throw new common_1.BadRequestException('Invalid or expired promo code');
        }
        return { code: promo.code, discountPct: promo.discountPct };
    }
    async getWireDetails(userId) {
        const assignment = await this.prisma.userWireAccount.findUnique({
            where: { userId },
        });
        if (assignment) {
            const account = await this.prisma.wireBankAccount.findUnique({
                where: { id: assignment.wireAccountId },
            });
            if (account)
                return account;
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true },
        });
        const countryCode = user?.profile?.nationality || user?.profile?.country || 'US';
        const country = await this.prisma.country.findFirst({
            where: { code: countryCode },
        });
        if (country) {
            const wireAccount = await this.prisma.wireBankAccount.findFirst({
                where: { countryId: country.id, isActive: true },
            });
            if (wireAccount)
                return wireAccount;
        }
        const defaultAccount = await this.prisma.wireBankAccount.findFirst({
            where: {
                bankName: { contains: 'Bank of America', mode: 'insensitive' },
                isActive: true,
            },
        });
        if (defaultAccount)
            return defaultAccount;
        throw new common_1.NotFoundException('No wire transfer account available');
    }
    async initCryptoPayment(userId, invoiceId, currency, amount) {
        const wallet = await this.prisma.cryptoWallet.findFirst({
            where: { currency: currency, isActive: true },
        });
        if (!wallet) {
            throw new common_1.BadRequestException('No active wallet found for this currency');
        }
        const expiresAt = new Date(Date.now() + 20 * 60 * 1000);
        const session = await this.prisma.cryptoPaymentSession.create({
            data: {
                invoiceId,
                userId,
                currency: currency,
                walletAddress: wallet.address,
                amount,
                status: 'PENDING',
                confirmations: 0,
                expiresAt,
            },
        });
        return session;
    }
    async confirmCryptoPayment(sessionId) {
        const session = await this.prisma.cryptoPaymentSession.findUnique({
            where: { id: sessionId },
        });
        if (!session || session.status !== 'PENDING')
            throw new common_1.BadRequestException('Invalid session');
        const methodId = await this.getPaymentMethodIdByType('CRYPTO');
        if (!methodId)
            throw new common_1.BadRequestException('Crypto payment method not available');
        const updatedSession = await this.prisma.cryptoPaymentSession.update({
            where: { id: sessionId },
            data: { confirmations: 5, status: 'CONFIRMED' },
        });
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
        }
        else {
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
            await this.mailService.sendPaymentProcessing(user.email, session.invoiceId);
        return { session: updatedSession, approval };
    }
    async initPayPalPayment(userId, invoiceId) {
        const methodId = await this.getPaymentMethodIdByType('PAYPAL');
        if (!methodId)
            throw new common_1.BadRequestException('PayPal payment method not available');
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
        }
        else {
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
        return { redirectUrl: `https://paypal.com/checkout/${(0, uuid_1.v4)()}`, approval };
    }
    async confirmPayPal(userId, invoiceId) {
        const existingApproval = await this.prisma.paymentApproval.findUnique({
            where: { invoiceId },
        });
        if (!existingApproval)
            throw new common_1.NotFoundException('No pending approval found');
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
    async initiateWireTransfer(userId, invoiceId) {
        const methodId = await this.getPaymentMethodIdByType('BANK_TRANSFER');
        if (!methodId)
            throw new common_1.BadRequestException('Bank transfer method not available');
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
        }
        else {
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
        return { approval };
    }
    async confirmWireTransfer(userId, invoiceId) {
        const existingApproval = await this.prisma.paymentApproval.findUnique({
            where: { invoiceId },
        });
        if (!existingApproval)
            throw new common_1.NotFoundException('No pending approval found');
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
    async reviewApproval(approvalId, status, reviewedById, reason) {
        const approval = await this.prisma.paymentApproval.findUnique({
            where: { id: approvalId },
        });
        if (!approval)
            throw new common_1.NotFoundException('Approval not found');
        const updated = await this.prisma.paymentApproval.update({
            where: { id: approvalId },
            data: {
                status: status,
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
            if (!invoice)
                throw new common_1.NotFoundException('Invoice not found');
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
                        method: client_1.PaymentMethodEnum.CRYPTO,
                    },
                });
                const user = await this.prisma.user.findUnique({
                    where: { id: invoice.userId },
                });
                if (user)
                    await this.mailService.sendWalletDepositConfirmation(user.email, invoice.amount);
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
            await this.notificationsService.createNotification(invoice.userId, 'Payment Approved', 'Your payment has been confirmed by our Payment Verification Team.', { invoiceId });
        }
        else if (status === 'DECLINED') {
            await this.prisma.invoice.update({
                where: { id: invoiceId },
                data: { status: 'CANCELLED' },
            });
            const invoice = await this.prisma.invoice.findUnique({
                where: { id: invoiceId },
            });
            if (!invoice)
                throw new common_1.NotFoundException('Invoice not found');
            const user = await this.prisma.user.findUnique({
                where: { id: invoice.userId },
            });
            if (user)
                await this.mailService.sendPaymentDeclined(user.email, invoiceId, reason || 'Transaction failed');
            if (invoice.userId)
                this.eventsGateway.emitToUser(invoice.userId, 'payment-updated', {
                    status: 'DECLINED',
                });
            await this.notificationsService.createNotification(invoice.userId, 'Payment Declined', 'Your payment was unsuccessful. Reason: ' +
                (reason || 'Transaction failed'), { invoiceId });
        }
        return updated;
    }
    async requestApproval(invoiceId, userId, paymentMethodType) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id: invoiceId },
        });
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found');
        let methodId = null;
        if (paymentMethodType) {
            methodId = await this.getPaymentMethodIdByType(paymentMethodType);
            if (!methodId)
                throw new common_1.BadRequestException('Payment method not available');
        }
        else {
            methodId = await this.getPaymentMethodIdByType('BANK_TRANSFER');
            if (!methodId)
                throw new common_1.BadRequestException('Bank transfer method not available');
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
        }
        else {
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
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        mail_service_1.MailService,
        events_gateway_1.EventsGateway,
        notifications_service_1.NotificationsService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map