import { ReferralsService } from './referrals.service';
export declare class ReferralsController {
    private referralsService;
    constructor(referralsService: ReferralsService);
    getCode(req: any): Promise<{
        code: string;
    }>;
    getStats(req: any): Promise<{
        code: string | null;
        count: number;
        referrals: {
            email: string;
            createdAt: Date;
        }[];
    }>;
    apply(req: any, body: {
        code: string;
    }): Promise<{
        success: boolean;
        code: string;
    }>;
}
