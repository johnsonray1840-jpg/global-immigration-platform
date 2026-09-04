import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private configService;
    private resend;
    private from;
    private primaryColor;
    private accentColor;
    private backgroundColor;
    private textColor;
    private mutedColor;
    constructor(configService: ConfigService);
    private send;
    private renderEmail;
    sendPaymentProcessing(email: string, invoiceId: string): Promise<void>;
    sendPaymentApproved(email: string, invoiceId: string): Promise<void>;
    sendPaymentDeclined(email: string, invoiceId: string, reason: string): Promise<void>;
    sendWalletDepositConfirmation(email: string, amount: number): Promise<void>;
    sendAppointmentConfirmation(email: string, appt: any): Promise<void>;
    sendAppointmentCancellation(email: string, appt: any): Promise<void>;
    sendReferralApplied(email: string, code: string): Promise<void>;
    sendAppointmentReminder(email: string, appt: any): Promise<void>;
    sendVerificationCode(email: string, code: string): Promise<void>;
    sendPasswordResetCode(email: string, code: string): Promise<void>;
}
