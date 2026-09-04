import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private analyticsService;
    constructor(analyticsService: AnalyticsService);
    overview(): Promise<{
        totalUsers: number;
        totalCases: number;
        totalPayments: number;
        totalRevenue: number;
        totalCountries: number;
    }>;
    countryDemand(): Promise<(import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.CaseGroupByOutputType, "destinationCountryId"[]> & {
        _count: {
            _all: number;
        };
    })[]>;
    activity(): Promise<({
        user: {
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        oldValue: import("@prisma/client/runtime/library").JsonValue | null;
        newValue: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
    })[]>;
}
