import { PrismaService } from '../prisma/prisma.service';
import { PaymentsService } from '../payments/payments.service';
export declare class WalletService {
    private prisma;
    private paymentsService;
    constructor(prisma: PrismaService, paymentsService: PaymentsService);
    getWallet(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        userId: string;
        balance: number;
    }>;
    getTransactionHistory(userId: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        type: string;
        amount: number;
        invoiceId: string | null;
        method: import(".prisma/client").$Enums.PaymentMethodEnum | null;
        reference: string | null;
        walletId: string;
    }[]>;
    requestDeposit(userId: string, amount: number, paymentMethodType: string, promoCode?: string): Promise<{
        invoice: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            currency: string;
            userId: string;
            status: import(".prisma/client").$Enums.InvoiceStatus;
            caseId: string | null;
            amount: number;
            expiresAt: Date | null;
            promoCode: string | null;
            breakdownJson: import("@prisma/client/runtime/library").JsonValue | null;
            walletDeposit: boolean;
            packageId: string | null;
        };
        approval: any;
    }>;
}
