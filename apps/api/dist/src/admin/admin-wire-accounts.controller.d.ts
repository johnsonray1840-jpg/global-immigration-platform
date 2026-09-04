import { PrismaService } from '../prisma/prisma.service';
export declare class AdminWireAccountsController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        country: {
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
        address: string | null;
        isActive: boolean;
        countryId: string;
        bankName: string;
        accountName: string;
        accountNumber: string;
        swiftCode: string;
        routingNumber: string | null;
        iban: string | null;
        isFallback: boolean;
    })[]>;
    create(body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        isActive: boolean;
        countryId: string;
        bankName: string;
        accountName: string;
        accountNumber: string;
        swiftCode: string;
        routingNumber: string | null;
        iban: string | null;
        isFallback: boolean;
    }>;
    update(id: string, body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        isActive: boolean;
        countryId: string;
        bankName: string;
        accountName: string;
        accountNumber: string;
        swiftCode: string;
        routingNumber: string | null;
        iban: string | null;
        isFallback: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        isActive: boolean;
        countryId: string;
        bankName: string;
        accountName: string;
        accountNumber: string;
        swiftCode: string;
        routingNumber: string | null;
        iban: string | null;
        isFallback: boolean;
    }>;
    assignToUser(body: {
        userId: string;
        wireAccountId: string;
    }): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        wireAccountId: string;
        assignedAt: Date;
    }>;
}
