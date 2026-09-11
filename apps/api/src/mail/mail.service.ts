import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend | null = null;
  private from: string;

  // Brand colors
  private primaryColor = '#0B5D66';
  private accentColor = '#C9A96E';
  private backgroundColor = '#F8FAFA';
  private textColor = '#111827';
  private mutedColor = '#6B7280';

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.from =
      this.configService.get<string>('EMAIL_FROM') ||
      'Global Immigration <support@gcsworldwide.org>';

    if (apiKey) {
      this.resend = new Resend(apiKey);
      console.log('✅ Resend email service configured');
    } else {
      console.warn('⚠️ RESEND_API_KEY not set. Emails will be logged to console.');
    }
  }

  private async send(to: string, subject: string, html: string) {
    if (this.resend) {
      try {
        await this.resend.emails.send({
          from: this.from,
          to,
          subject,
          html,
        });
        console.log(`📧 Email sent to ${to} (${subject})`);
      } catch (error) {
        console.error(`❌ Failed to send email to ${to}:`, error);
      }
    } else {
      console.log(`[EMAIL LOG] To: ${to}\nSubject: ${subject}\n${html}`);
    }
  }

  private renderEmail(opts: {
    title: string;
    body: string;
    ctaText?: string;
    ctaLink?: string;
  }): string {
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

  // Payment emails
  async sendPaymentProcessing(email: string, invoiceId: string) {
    const html = this.renderEmail({
      title: 'Payment Processing',
      body: `<p>Your payment for invoice <strong>${invoiceId}</strong> is being processed by our <strong>Payment Verification Team</strong>. This usually takes 30–45 minutes.</p>`,
    });
    await this.send(email, 'Payment Processing', html);
  }

  async sendPaymentApproved(email: string, invoiceId: string) {
    const html = this.renderEmail({
      title: 'Payment Confirmed',
      body: `<p>We are pleased to inform you that our <strong>Payment Verification Team</strong> has successfully confirmed your payment for invoice <strong>${invoiceId}</strong>.</p>`,
    });
    await this.send(email, 'Payment Confirmed', html);
  }

  async sendPaymentDeclined(email: string, invoiceId: string, reason: string) {
    const html = this.renderEmail({
      title: 'Payment Unsuccessful',
      body: `<p>We regret to inform you that our <strong>Payment Verification Team</strong> was unable to process your payment for invoice <strong>${invoiceId}</strong>.</p><p>Reason: ${reason}</p>`,
    });
    await this.send(email, 'Payment Unsuccessful', html);
  }

  async sendWalletDepositConfirmation(email: string, amount: number) {
    const html = this.renderEmail({
      title: 'Wallet Deposit Successful',
      body: `<p>Your wallet has been credited with <strong>$${amount}</strong>.</p>`,
    });
    await this.send(email, 'Wallet Deposit Successful', html);
  }

  // Appointment emails
  async sendAppointmentConfirmation(email: string, appt: any) {
    const html = this.renderEmail({
      title: 'Appointment Confirmed',
      body: `<p>Your appointment is scheduled for <strong>${appt.scheduledAt}</strong>.</p>`,
    });
    await this.send(email, 'Appointment Confirmed', html);
  }

  async sendAppointmentCancellation(email: string, appt: any) {
    const html = this.renderEmail({
      title: 'Appointment Cancelled',
      body: `<p>Your appointment on <strong>${appt.scheduledAt}</strong> has been cancelled.</p>`,
    });
    await this.send(email, 'Appointment Cancelled', html);
  }

  // Referral emails
  async sendReferralApplied(email: string, code: string) {
    const html = this.renderEmail({
      title: 'Referral Code Applied',
      body: `<p>You have successfully applied referral code <strong>${code}</strong>.</p>`,
    });
    await this.send(email, 'Referral Code Applied', html);
  }

  // Notification emails
  async sendAppointmentReminder(email: string, appt: any) {
    const html = this.renderEmail({
      title: 'Appointment Reminder',
      body: `<p>You have an appointment scheduled for <strong>${appt.scheduledAt}</strong>.</p>`,
    });
    await this.send(email, 'Appointment Reminder', html);
  }

  // Verification emails
  async sendVerificationCode(email: string, code: string) {
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

  // Password reset emails
  async sendPasswordResetCode(email: string, code: string) {
    const html = this.renderEmail({
      title: 'Password Reset',
      body: `<p>Your 6-digit password reset code is:</p>
             <p style="font-size:24px; font-weight:bold; letter-spacing:2px;">${code}</p>
             <p>This code expires in 15 minutes.</p>`,
    });
    await this.send(email, 'Password Reset Code', html);
  }
}