import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { EventsGateway } from '../real-time/events.gateway';
import { NotificationsService } from '../notifications/notifications.service';
export declare class PaymentsService {
    private prisma;
    private configService;
    private mailService;
    private eventsGateway;
    private notificationsService;
    constructor(prisma: PrismaService, configService: ConfigService, mailService: MailService, eventsGateway: EventsGateway, notificationsService: NotificationsService);
    private getPaymentMethodIdByType;
    getPaymentMethods(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        displayName: string;
        type: import(".prisma/client").$Enums.PaymentMethodEnum;
        logoUrl: string | null;
        suspensionMessage: string | null;
    }[]>;
    getActiveCryptoWallets(): Promise<{
        id: string;
        currency: import(".prisma/client").$Enums.CryptoCurrency;
        address: string;
        isActive: boolean;
    }[]>;
    createInvoice(userId: string, data: {
        packageId?: string;
        caseId?: string;
        amount?: number;
        breakdown?: any;
        promoCode?: string;
    }): Promise<{
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
    applyPromoCode(code: string): Promise<{
        code: string;
        discountPct: number;
    }>;
    getWireDetails(userId: string): Promise<{
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
    initCryptoPayment(userId: string, invoiceId: string, currency: string, amount: number): Promise<{
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
    confirmCryptoPayment(sessionId: string): Promise<{
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
    initPayPalPayment(userId: string, invoiceId: string): Promise<{
        redirectUrl: string;
        approval: any;
    }>;
    confirmPayPal(userId: string, invoiceId: string): Promise<{
        approval: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentRequestStatus;
            invoiceId: string;
            requestedById: string | null;
            reviewedById: string | null;
            reason: string | null;
            paymentMethodId: string | null;
        };
    }>;
    initiateWireTransfer(userId: string, invoiceId: string): Promise<{
        approval: any;
    }>;
    confirmWireTransfer(userId: string, invoiceId: string): Promise<{
        approval: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentRequestStatus;
            invoiceId: string;
            requestedById: string | null;
            reviewedById: string | null;
            reason: string | null;
            paymentMethodId: string | null;
        };
    }>;
    reviewApproval(approvalId: string, status: string, reviewedById: string, reason?: string): Promise<{
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
    requestApproval(invoiceId: string, userId: string, paymentMethodType?: string): Promise<any>;
    getAllApprovals(): Promise<({
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
}
