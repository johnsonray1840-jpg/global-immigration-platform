import { ConsultantService } from './consultant.service';
export declare class ConsultantController {
    private consultantService;
    constructor(consultantService: ConsultantService);
    getStats(req: any): Promise<{
        assignedCases: number;
        pendingDocuments: number;
        upcomingAppointments: number;
    }>;
    getAssignedCases(req: any): Promise<({
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
        originCountry: {
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
        visaRule: ({
            visaType: {
                id: string;
                category: import(".prisma/client").$Enums.VisaCategory;
                description: string | null;
                name: string;
                isGlobal: boolean;
            };
        } & {
            id: string;
            lastUpdated: Date;
            eligibilityJson: import("@prisma/client/runtime/library").JsonValue;
            requiredDocs: import("@prisma/client/runtime/library").JsonValue | null;
            governmentFee: number | null;
            feeCurrency: string;
            processingTimeMin: number | null;
            processingTimeMax: number | null;
            validityPeriod: number | null;
            renewalAllowed: boolean;
            workspaceSchema: import("@prisma/client/runtime/library").JsonValue | null;
            countryId: string;
            visaTypeId: string;
        }) | null;
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
    getCaseDetails(req: any, id: string): Promise<{
        documents: {
            id: string;
            updatedAt: Date;
            name: string;
            userId: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            type: string;
            expiryDate: Date | null;
            fileUrl: string;
            ocrText: string | null;
            uploadedAt: Date;
            caseId: string;
            verifiedById: string | null;
        }[];
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
        originCountry: {
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
        visaRule: ({
            visaType: {
                id: string;
                category: import(".prisma/client").$Enums.VisaCategory;
                description: string | null;
                name: string;
                isGlobal: boolean;
            };
        } & {
            id: string;
            lastUpdated: Date;
            eligibilityJson: import("@prisma/client/runtime/library").JsonValue;
            requiredDocs: import("@prisma/client/runtime/library").JsonValue | null;
            governmentFee: number | null;
            feeCurrency: string;
            processingTimeMin: number | null;
            processingTimeMax: number | null;
            validityPeriod: number | null;
            renewalAllowed: boolean;
            workspaceSchema: import("@prisma/client/runtime/library").JsonValue | null;
            countryId: string;
            visaTypeId: string;
        }) | null;
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
    }>;
    updateStatus(req: any, id: string, body: {
        status: string;
    }): Promise<{
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
    }>;
    updateNotes(req: any, id: string, body: {
        notes: string;
    }): Promise<{
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
    }>;
    getDocuments(req: any, id: string): Promise<{
        id: string;
        updatedAt: Date;
        name: string;
        userId: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        type: string;
        expiryDate: Date | null;
        fileUrl: string;
        ocrText: string | null;
        uploadedAt: Date;
        caseId: string;
        verifiedById: string | null;
    }[]>;
    verifyDocument(req: any, id: string, body: {
        verified: boolean;
    }): Promise<{
        id: string;
        updatedAt: Date;
        name: string;
        userId: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        type: string;
        expiryDate: Date | null;
        fileUrl: string;
        ocrText: string | null;
        uploadedAt: Date;
        caseId: string;
        verifiedById: string | null;
    }>;
}
