import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuid } from 'uuid';
import { NotificationsService } from '../notifications/notifications.service';


@Injectable()
export class ReferralsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,

  ) {}


  async getOrCreateReferralCode(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    let code = user.referralCode;
    if (!code) {
      code = 'GIP-' + uuid().slice(0, 8).toUpperCase();
      await this.prisma.user.update({
        where: { id: userId },
        data: { referralCode: code },
      });
    }
    return { code };
  }

  async applyReferralCode(userId: string, code: string) {
    if (!code) throw new BadRequestException('Referral code is required');

    const referrer = await this.prisma.user.findUnique({
      where: { referralCode: code },
    });
    if (!referrer) throw new NotFoundException('Invalid referral code');
    if (referrer.id === userId) throw new BadRequestException('You cannot refer yourself');

    const existing = await this.prisma.referral.findFirst({
      where: { refereeId: userId },
    });
    if (existing) throw new BadRequestException('You have already used a referral code');

    await this.prisma.referral.create({
      data: {
        referrerId: referrer.id,
        refereeId: userId,
        code,
        rewardStatus: 'PENDING',
      },
    });

    await this.notificationsService.createNotification(
      userId,
      'Referral Applied',
      'You have successfully applied a referral code.',
      { referralCode: code }
    );

    return { success: true, code };
  }

  async getReferralStats(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

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
}
