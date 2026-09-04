import { WalletService } from './wallet.service';
export declare class WalletController {
    private walletService;
    constructor(walletService: WalletService);
    getWallet(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        userId: string;
        balance: number;
    }>;
    getTransactions(req: any): Promise<{
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
    deposit(req: any, body: {
        amount: number;
        paymentMethodId: string;
    }): Promise<{
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
