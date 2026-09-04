import { PrismaService } from '../prisma/prisma.service';
export declare class WorkspaceService {
    private prisma;
    constructor(prisma: PrismaService);
    getCaseWorkspace(userId: string, caseId: string): Promise<{
        caseId: string;
        schema: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray | null;
        data: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray | null;
        reviewed: boolean;
    }>;
    saveWorkspace(userId: string, caseId: string, formData: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        caseId: string;
        formData: import("@prisma/client/runtime/library").JsonValue;
        reviewed: boolean;
    }>;
    getAllForConsultant(consultantUserId: string): Promise<({
        user: {
            email: string;
            profile: {
                id: string;
                country: string | null;
                firstName: string | null;
                lastName: string | null;
                nationality: string | null;
                dateOfBirth: Date | null;
                phone: string | null;
                addressLine1: string | null;
                addressLine2: string | null;
                city: string | null;
                postalCode: string | null;
                occupation: string | null;
                educationLevel: string | null;
                annualIncome: number | null;
                maritalStatus: string | null;
                languageTest: string | null;
                investmentBudget: number | null;
                familySize: number | null;
                migrationPurpose: string | null;
                preferredDestinations: string[];
                userId: string;
            } | null;
        };
        workspaceData: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            caseId: string;
            formData: import("@prisma/client/runtime/library").JsonValue;
            reviewed: boolean;
        } | null;
        destinationCountry: {
            id: string;
            name: string;
            currency: string | null;
            code: string;
            continent: string | null;
            passportRank: number | null;
            safetyIndex: number | null;
            livingCostIndex: number | null;
            healthcareIndex: number | null;
            educationIndex: number | null;
            taxRate: number | null;
            languages: string[];
            climate: string | null;
            imageUrl: string | null;
            lastUpdated: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        originCountryId: string;
        destinationCountryId: string;
        visaRuleId: string | null;
        eligibilityLabel: import(".prisma/client").$Enums.EligibilityLabel | null;
        status: import(".prisma/client").$Enums.CaseStatus;
        timeline: import("@prisma/client/runtime/library").JsonValue | null;
        governmentFeeEstimate: number | null;
        serviceFeeEstimate: number | null;
        totalCostEstimate: number | null;
        estimatedProcessingDays: number | null;
        notes: string | null;
        consultantId: string | null;
    })[]>;
    reviewWorkspace(consultantUserId: string, caseId: string, reviewed: boolean): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        caseId: string;
        formData: import("@prisma/client/runtime/library").JsonValue;
        reviewed: boolean;
    }>;
}
