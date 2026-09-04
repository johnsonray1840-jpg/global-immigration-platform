import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class ReferralsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    getOrCreateReferralCode(userId: string): Promise<{
        code: string;
    }>;
    applyReferralCode(userId: string, code: string): Promise<{
        success: boolean;
        code: string;
    }>;
    getReferralStats(userId: string): Promise<{
        code: string | null;
        count: number;
        referrals: {
            email: string;
            createdAt: Date;
        }[];
    }>;
}
