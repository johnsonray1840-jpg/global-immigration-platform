import { PaymentsService } from '../payments/payments.service';
export declare class AdminApprovalsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    getAll(): Promise<({
        invoice: {
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                googleId: string | null;
                appleId: string | null;
                microsoftId: string | null;
                referralCode: string | null;
                passwordHash: string | null;
                role: import(".prisma/client").$Enums.Role;
                isEmailVerified: boolean;
                twoFactorEnabled: boolean;
                twoFactorSecret: string | null;
                kycStatus: string | null;
                passportExpiry: Date | null;
                preferredLanguage: string;
                darkMode: boolean;
                deletedAt: Date | null;
                onboardingCompleted: boolean;
                verificationCode: string | null;
                verificationCodeExpires: Date | null;
                resetCode: string | null;
                resetCodeExpires: Date | null;
            };
            package: {
                id: string;
                category: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                currency: string;
                isActive: boolean;
                imageUrl: string | null;
                includes: string[];
                serviceFee: number;
            } | null;
        } & {
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
        paymentMethod: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            displayName: string;
            type: import(".prisma/client").$Enums.PaymentMethodEnum;
            logoUrl: string | null;
            suspensionMessage: string | null;
        } | null;
        requestedBy: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            googleId: string | null;
            appleId: string | null;
            microsoftId: string | null;
            referralCode: string | null;
            passwordHash: string | null;
            role: import(".prisma/client").$Enums.Role;
            isEmailVerified: boolean;
            twoFactorEnabled: boolean;
            twoFactorSecret: string | null;
            kycStatus: string | null;
            passportExpiry: Date | null;
            preferredLanguage: string;
            darkMode: boolean;
            deletedAt: Date | null;
            onboardingCompleted: boolean;
            verificationCode: string | null;
            verificationCodeExpires: Date | null;
            resetCode: string | null;
            resetCodeExpires: Date | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PaymentRequestStatus;
        invoiceId: string;
        requestedById: string | null;
        reviewedById: string | null;
        reason: string | null;
        paymentMethodId: string | null;
    })[]>;
    review(id: string, body: {
        status: string;
        reason?: string;
    }, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PaymentRequestStatus;
        invoiceId: string;
        requestedById: string | null;
        reviewedById: string | null;
        reason: string | null;
        paymentMethodId: string | null;
    }>;
}
