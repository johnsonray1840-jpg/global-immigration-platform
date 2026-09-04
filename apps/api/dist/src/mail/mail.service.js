"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
let MailService = class MailService {
    configService;
    resend = null;
    from;
    primaryColor = '#0B5D66';
    accentColor = '#C9A96E';
    backgroundColor = '#F8FAFA';
    textColor = '#111827';
    mutedColor = '#6B7280';
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('RESEND_API_KEY');
        this.from =
            this.configService.get('EMAIL_FROM') ||
                'Global Immigration <support@ctcorporationbusiness.com>';
        if (apiKey) {
            this.resend = new resend_1.Resend(apiKey);
            console.log('✅ Resend email service configured');
        }
        else {
            console.warn('⚠️ RESEND_API_KEY not set. Emails will be logged to console.');
        }
    }
    async send(to, subject, html) {
        if (this.resend) {
            try {
                await this.resend.emails.send({
                    from: this.from,
                    to,
                    subject,
                    html,
                });
                console.log(`📧 Email sent to ${to} (${subject})`);
            }
            catch (error) {
                console.error(`❌ Failed to send email to ${to}:`, error);
            }
        }
        else {
            console.log(`[EMAIL LOG] To: ${to}\nSubject: ${subject}\n${html}`);
        }
    }
    renderEmail(opts) {
        const ctaHtml = opts.ctaText
            ? `
        <div style="margin: 24px 0;">
          <a href="${opts.ctaLink || '#'}" style="background-color: ${this.primaryColor}; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">${opts.ctaText}</a>
        </div>
      `
            : '';
        return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${opts.title}</title>
    </head>
    <body style="margin:0; padding:0; background-color:${this.backgroundColor}; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:${this.backgroundColor};">
        <tr>
          <td align="center" style="padding:20px 0;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
              <!-- Header -->
              <tr>
                <td style="background-color:${this.primaryColor}; padding:24px 32px;">
                  <h1 style="margin:0; font-size:24px; font-weight:700; color:#ffffff;">Global<span style="color:${this.accentColor};">Immigration</span></h1>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:32px;">
                  <h2 style="margin:0 0 16px 0; font-size:20px; font-weight:600; color:${this.textColor};">${opts.title}</h2>
                  <div style="font-size:16px; line-height:1.6; color:${this.mutedColor};">
                    ${opts.body}
                  </div>
                  ${ctaHtml}
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color:${this.backgroundColor}; padding:20px 32px; text-align:center; font-size:12px; color:${this.mutedColor};">
                  <p style="margin:0;">© ${new Date().getFullYear()} Global Immigration Services. All rights reserved.</p>
                  <p style="margin:4px 0 0;">This email is intended for the recipient only. If you received this in error, please delete it.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
    }
    async sendPaymentProcessing(email, invoiceId) {
        const html = this.renderEmail({
            title: 'Payment Processing',
            body: `<p>Your payment for invoice <strong>${invoiceId}</strong> is being processed by our <strong>Payment Verification Team</strong>. This usually takes 30–45 minutes.</p>`,
        });
        await this.send(email, 'Payment Processing', html);
    }
    async sendPaymentApproved(email, invoiceId) {
        const html = this.renderEmail({
            title: 'Payment Confirmed',
            body: `<p>We are pleased to inform you that our <strong>Payment Verification Team</strong> has successfully confirmed your payment for invoice <strong>${invoiceId}</strong>.</p>`,
        });
        await this.send(email, 'Payment Confirmed', html);
    }
    async sendPaymentDeclined(email, invoiceId, reason) {
        const html = this.renderEmail({
            title: 'Payment Unsuccessful',
            body: `<p>We regret to inform you that our <strong>Payment Verification Team</strong> was unable to process your payment for invoice <strong>${invoiceId}</strong>.</p><p>Reason: ${reason}</p>`,
        });
        await this.send(email, 'Payment Unsuccessful', html);
    }
    async sendWalletDepositConfirmation(email, amount) {
        const html = this.renderEmail({
            title: 'Wallet Deposit Successful',
            body: `<p>Your wallet has been credited with <strong>$${amount}</strong>.</p>`,
        });
        await this.send(email, 'Wallet Deposit Successful', html);
    }
    async sendAppointmentConfirmation(email, appt) {
        const html = this.renderEmail({
            title: 'Appointment Confirmed',
            body: `<p>Your appointment is scheduled for <strong>${appt.scheduledAt}</strong>.</p>`,
        });
        await this.send(email, 'Appointment Confirmed', html);
    }
    async sendAppointmentCancellation(email, appt) {
        const html = this.renderEmail({
            title: 'Appointment Cancelled',
            body: `<p>Your appointment on <strong>${appt.scheduledAt}</strong> has been cancelled.</p>`,
        });
        await this.send(email, 'Appointment Cancelled', html);
    }
    async sendReferralApplied(email, code) {
        const html = this.renderEmail({
            title: 'Referral Code Applied',
            body: `<p>You have successfully applied referral code <strong>${code}</strong>.</p>`,
        });
        await this.send(email, 'Referral Code Applied', html);
    }
    async sendAppointmentReminder(email, appt) {
        const html = this.renderEmail({
            title: 'Appointment Reminder',
            body: `<p>You have an appointment scheduled for <strong>${appt.scheduledAt}</strong>.</p>`,
        });
        await this.send(email, 'Appointment Reminder', html);
    }
    async sendVerificationCode(email, code) {
        const html = this.renderEmail({
            title: 'Verify Your Email',
            body: `<p>Your 6-digit verification code is:</p>
             <p style="font-size:24px; font-weight:bold; letter-spacing:2px;">${code}</p>
             <p>This code expires in 15 minutes.</p>`,
            ctaText: 'Verify Email',
            ctaLink: 'https://globalimmigration.example.com/verify-email',
        });
        await this.send(email, 'Email Verification Code', html);
    }
    async sendPasswordResetCode(email, code) {
        const html = this.renderEmail({
            title: 'Password Reset',
            body: `<p>Your 6-digit password reset code is:</p>
             <p style="font-size:24px; font-weight:bold; letter-spacing:2px;">${code}</p>
             <p>This code expires in 15 minutes.</p>`,
        });
        await this.send(email, 'Password Reset Code', html);
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map