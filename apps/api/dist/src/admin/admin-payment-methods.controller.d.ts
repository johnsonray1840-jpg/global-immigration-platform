import { PrismaService } from '../prisma/prisma.service';
export declare class AdminPaymentMethodsController {
    private prisma;
    constructor(prisma: PrismaService);
    getAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        displayName: string;
        type: import(".prisma/client").$Enums.PaymentMethodEnum;
        logoUrl: string | null;
        suspensionMessage: string | null;
    }[]>;
    toggle(id: string, body: {
        isActive?: boolean;
        suspensionMessage?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        displayName: string;
        type: import(".prisma/client").$Enums.PaymentMethodEnum;
        logoUrl: string | null;
        suspensionMessage: string | null;
    }>;
}
