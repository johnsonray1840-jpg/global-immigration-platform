import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    getMethods(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        displayName: string;
        type: import(".prisma/client").$Enums.PaymentMethodEnum;
        logoUrl: string | null;
        suspensionMessage: string | null;
    }[]>;
    createInvoice(req: any, body: any): Promise<{
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
    }>;
    getWireDetails(req: any): Promise<{
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
    initCrypto(req: any, body: {
        invoiceId: string;
        currency: string;
        amount: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        currency: import(".prisma/client").$Enums.CryptoCurrency;
        userId: string;
        status: import(".prisma/client").$Enums.PaymentRequestStatus;
        amount: number;
        expiresAt: Date;
        walletAddress: string;
        confirmations: number;
        invoiceId: string;
    }>;
    confirmCrypto(req: any, sessionId: string): Promise<{
        session: {
            id: string;
            createdAt: Date;
            currency: import(".prisma/client").$Enums.CryptoCurrency;
            userId: string;
            status: import(".prisma/client").$Enums.PaymentRequestStatus;
            amount: number;
            expiresAt: Date;
            walletAddress: string;
            confirmations: number;
            invoiceId: string;
        };
        approval: any;
    }>;
    initPaypal(req: any, body: {
        invoiceId: string;
    }): Promise<{
        redirectUrl: string;
        approval: any;
    }>;
    initWire(req: any, body: {
        invoiceId: string;
    }): Promise<{
        approval: any;
    }>;
    requestApproval(req: any, body: {
        invoiceId: string;
        paymentMethodId?: string;
    }): Promise<any>;
    getCryptoWallets(): Promise<{
        id: string;
        currency: import(".prisma/client").$Enums.CryptoCurrency;
        address: string;
        isActive: boolean;
    }[]>;
}
