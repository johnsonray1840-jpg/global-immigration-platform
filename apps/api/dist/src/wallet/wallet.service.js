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
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const payments_service_1 = require("../payments/payments.service");
let WalletService = class WalletService {
    prisma;
    paymentsService;
    constructor(prisma, paymentsService) {
        this.prisma = prisma;
        this.paymentsService = paymentsService;
    }
    async getWallet(userId) {
        return this.prisma.wallet.upsert({
            where: { userId },
            create: { userId, balance: 0, currency: 'USD' },
            update: {},
        });
    }
    async getTransactionHistory(userId) {
        const wallet = await this.getWallet(userId);
        return this.prisma.walletTransaction.findMany({
            where: { walletId: wallet.id },
            orderBy: { createdAt: 'desc' },
        });
    }
    async requestDeposit(userId, amount, paymentMethodType, promoCode) {
        if (amount <= 0)
            throw new common_1.BadRequestException('Amount must be positive');
        let finalAmount = amount;
        let discount = 0;
        if (promoCode) {
            const promo = await this.prisma.promotion.findUnique({
                where: { code: promoCode },
            });
            if (promo &&
                promo.isActive &&
                (!promo.validUntil || promo.validUntil > new Date())) {
                discount = amount * (promo.discountPct / 100);
                finalAmount = amount - discount;
            }
        }
        const method = await this.prisma.paymentMethod.findFirst({
            where: { type: paymentMethodType, isActive: true },
        });
        if (!method) {
            throw new common_1.BadRequestException('Payment method not available');
        }
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
        }
        else {
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
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        payments_service_1.PaymentsService])
], WalletService);
//# sourceMappingURL=wallet.service.js.map