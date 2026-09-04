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
exports.ReferralsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const uuid_1 = require("uuid");
const notifications_service_1 = require("../notifications/notifications.service");
let ReferralsService = class ReferralsService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async getOrCreateReferralCode(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        let code = user.referralCode;
        if (!code) {
            code = 'GIP-' + (0, uuid_1.v4)().slice(0, 8).toUpperCase();
            await this.prisma.user.update({
                where: { id: userId },
                data: { referralCode: code },
            });
        }
        return { code };
    }
    async applyReferralCode(userId, code) {
        if (!code)
            throw new common_1.BadRequestException('Referral code is required');
        const referrer = await this.prisma.user.findUnique({
            where: { referralCode: code },
        });
        if (!referrer)
            throw new common_1.NotFoundException('Invalid referral code');
        if (referrer.id === userId)
            throw new common_1.BadRequestException('You cannot refer yourself');
        const existing = await this.prisma.referral.findFirst({
            where: { refereeId: userId },
        });
        if (existing)
            throw new common_1.BadRequestException('You have already used a referral code');
        await this.prisma.referral.create({
            data: {
                referrerId: referrer.id,
                refereeId: userId,
                code,
                rewardStatus: 'PENDING',
            },
        });
        await this.notificationsService.createNotification(userId, 'Referral Applied', 'You have successfully applied a referral code.', { referralCode: code });
        return { success: true, code };
    }
    async getReferralStats(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const referrals = await this.prisma.referral.findMany({
            where: { referrerId: userId },
            include: { referee: { select: { email: true, createdAt: true } } },
            orderBy: { createdAt: 'desc' },
        });
        return {
            code: user.referralCode,
            count: referrals.length,
            referrals: referrals.map((r) => ({
                email: r.referee?.email || 'Unknown',
                createdAt: r.createdAt,
            })),
        };
    }
};
exports.ReferralsService = ReferralsService;
exports.ReferralsService = ReferralsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], ReferralsService);
//# sourceMappingURL=referrals.service.js.map