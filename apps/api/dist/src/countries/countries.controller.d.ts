import { CountriesService } from './countries.service';
export declare class CountriesController {
    private countriesService;
    constructor(countriesService: CountriesService);
    findAll(): Promise<{
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
        imageUrl: string | null;
        lastUpdated: Date;
    }[]>;
    findOne(code: string): Promise<{
        visaRules: ({
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
        })[];
        scholarships: ({
            university: {
                id: string;
                createdAt: Date;
                name: string;
                countryId: string;
                ranking: number | null;
                tuitionRange: string | null;
                website: string | null;
            };
        } & {
            id: string;
            description: string | null;
            createdAt: Date;
            name: string;
            eligibilityJson: import("@prisma/client/runtime/library").JsonValue | null;
            countryId: string;
            link: string | null;
            universityId: string;
            fundingAmount: number | null;
            deadline: Date | null;
        })[];
        universities: {
            id: string;
            createdAt: Date;
            name: string;
            countryId: string;
            ranking: number | null;
            tuitionRange: string | null;
            website: string | null;
        }[];
    } & {
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
    }>;
}
