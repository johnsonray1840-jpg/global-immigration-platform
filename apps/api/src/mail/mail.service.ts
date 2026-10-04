import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

export interface CustomEmailOptions {
  to: string;
  subject: string;
  title?: string;
  body: string;
  recipientName?: string;
  ctaText?: string;
  ctaLink?: string;
  badge?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private resend: Resend | null = null;
  private from: string;

  // Brand aesthetics
  private brandName = 'Global Citizen Solutions';
  private brandWebsite = 'https://www.gcsworldwide.org';
  private logoUrl = 'https://www.gcsworldwide.org/logo.png';
  private supportEmail = 'support@gcsworldwide.org';

  private primaryNavy = '#0A192F';
  private darkTeal = '#0B5D66';
  private goldAccent = '#C9A96E';
  private softBg = '#F4F7F9';
  private textMain = '#1A202C';
  private textMuted = '#4A5568';
  private textLight = '#718096';

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.from =
      this.configService.get<string>('EMAIL_FROM') ||
      'Global Citizen Solutions <support@gcsworldwide.org>';

    if (apiKey) {
      this.resend = new Resend(apiKey);
      this.logger.log('✅ Resend email service initialized successfully');
    } else {
      this.logger.warn('⚠️ RESEND_API_KEY not configured. Emails will be logged to terminal.');
    }
  }

  private async send(to: string, subject: string, html: string): Promise<{ success: boolean; id?: string; error?: string }> {
    if (this.resend) {
      try {
        const response = await this.resend.emails.send({
          from: this.from,
          to,
          reply_to: 'support@gcsworldwide.org',
          subject,
          html,
        });

        if (response.error) {
          this.logger.error(`❌ Resend returned error for ${to}: ${JSON.stringify(response.error)}`);
          return { success: false, error: response.error.message };
        }

        this.logger.log(`📧 Email dispatched to ${to} (Subject: "${subject}", ID: ${response.data?.id})`);
        return { success: true, id: response.data?.id };
      } catch (error: any) {
        this.logger.error(`❌ Exception sending email to ${to}: ${error.message || error}`);
        return { success: false, error: error.message || 'Unknown email delivery error' };
      }
    } else {
      this.logger.log(`[DEVELOPMENT EMAIL DISPATCH]\nTo: ${to}\nFrom: ${this.from}\nSubject: ${subject}\n---\n${html.substring(0, 300)}...`);
      return { success: true, id: 'dev-mock-id' };
    }
  }

  /**
   * Executive HTML email template builder featuring official logo, gold & navy branding,
   * high readability card typography, dynamic CTA button, and official regulatory signature & footer.
   */
  public renderEmail(opts: {
    title: string;
    body: string;
    recipientName?: string;
    badge?: string;
    ctaText?: string;
    ctaLink?: string;
  }): string {
    const year = new Date().getFullYear();
    const formattedBody = opts.body.includes('<p>') || opts.body.includes('<div>')
      ? opts.body
      : opts.body
          .split('\n\n')
          .map((paragraph) => `<p style="margin: 0 0 16px 0; line-height: 1.65; color: ${this.textMain}; font-size: 15px;">${paragraph.replace(/\n/g, '<br/>')}</p>`)
          .join('');

    const greetingHtml = opts.recipientName
      ? `<p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: ${this.primaryNavy};">Dear ${opts.recipientName},</p>`
      : '';

    const badgeHtml = opts.badge
      ? `
        <div style="margin-bottom: 16px;">
          <span style="display: inline-block; background-color: rgba(201, 169, 110, 0.15); color: #8F7239; border: 1px solid rgba(201, 169, 110, 0.35); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.75px; padding: 4px 10px; border-radius: 9999px;">
            ${opts.badge}
          </span>
        </div>
      `
      : '';

    const ctaHtml = opts.ctaText && opts.ctaLink
      ? `
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 28px 0 24px 0;">
          <tr>
            <td align="center" style="border-radius: 8px; background: linear-gradient(135deg, ${this.darkTeal} 0%, #08434a 100%);">
              <a href="${opts.ctaLink}" target="_blank" style="display: inline-block; padding: 14px 32px; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px; letter-spacing: 0.2px;">
                ${opts.ctaText} &rarr;
              </a>
            </td>
          </tr>
        </table>
      `
      : '';

    return `
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>${opts.title}</title>
      <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
        p { margin: 0 0 16px 0; }
        a { color: ${this.darkTeal}; }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: ${this.softBg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: ${this.textMain};">
      
      <!-- Container -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${this.softBg};">
        <tr>
          <td align="center" style="padding: 36px 16px;">
            
            <!-- Email Wrapper Card -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06); border: 1px solid #E2E8F0;">
              
              <!-- Brand Header -->
              <tr>
                <td style="background-color: ${this.primaryNavy}; padding: 28px 36px; border-bottom: 3px solid ${this.goldAccent}; text-align: left;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td valign="middle">
                        <a href="${this.brandWebsite}" target="_blank" style="text-decoration: none; display: block;">
                          <img src="${this.logoUrl}" alt="${this.brandName}" height="42" style="height: 42px; width: auto; max-width: 220px; display: block; border: 0;" />
                        </a>
                      </td>
                      <td align="right" valign="middle" style="display: none; @media (min-width: 480px) { display: table-cell; }">
                        <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: ${this.goldAccent};">
                          Worldwide Advisory
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Main Content Body -->
              <tr>
                <td style="padding: 36px 36px 28px 36px; background-color: #ffffff;">
                  
                  ${badgeHtml}

                  <h1 style="margin: 0 0 20px 0; font-size: 22px; font-weight: 700; color: ${this.primaryNavy}; line-height: 1.35; letter-spacing: -0.3px;">
                    ${opts.title}
                  </h1>

                  ${greetingHtml}

                  <div style="font-size: 15px; line-height: 1.65; color: ${this.textMain};">
                    ${formattedBody}
                  </div>

                  ${ctaHtml}

                  <!-- Official Advisor Sign-Off -->
                  <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #EDF2F7;">
                    <p style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: ${this.primaryNavy};">
                      Global Citizen Solutions
                    </p>
                    <p style="margin: 0 0 4px 0; font-size: 13px; color: ${this.textMuted};">
                      Client Advisory & Communications Directorate
                    </p>
                    <p style="margin: 0; font-size: 12px; color: ${this.goldAccent}; font-weight: 500;">
                      <a href="mailto:${this.supportEmail}" style="color: ${this.darkTeal}; text-decoration: none;">${this.supportEmail}</a> &bull; <a href="${this.brandWebsite}" target="_blank" style="color: ${this.darkTeal}; text-decoration: none;">www.gcsworldwide.org</a>
                    </p>
                  </div>

                </td>
              </tr>

              <!-- Footer Information & Compliance -->
              <tr>
                <td style="background-color: #F8FAFC; padding: 24px 36px; border-top: 1px solid #E2E8F0; text-align: center;">
                  <p style="margin: 0 0 8px 0; font-size: 12px; color: ${this.textLight}; line-height: 1.5;">
                    &copy; ${year} Global Citizen Solutions Worldwide. All rights reserved.
                  </p>
                  <p style="margin: 0 0 8px 0; font-size: 11px; color: #A0AEC0; line-height: 1.4;">
                    This communication contains proprietary & confidential information intended solely for the recipient. If you have received this message in error, please notify <a href="mailto:${this.supportEmail}" style="color: ${this.darkTeal}; text-decoration: underline;">${this.supportEmail}</a> and delete this communication immediately.
                  </p>
                  <p style="margin: 0; font-size: 11px; color: #CBD5E0;">
                    London &bull; Lisbon &bull; Dubai &bull; Singapore &bull; Accra &bull; Miami
                  </p>
                </td>
              </tr>

            </table>
            <!-- End Email Card -->

          </td>
        </tr>
      </table>

    </body>
    </html>
    `;
  }

  /**
   * Send a custom branded email from the Admin dashboard to any recipient.
   */
  async sendCustomEmail(opts: CustomEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
    const html = this.renderEmail({
      title: opts.title || opts.subject,
      body: opts.body,
      recipientName: opts.recipientName,
      ctaText: opts.ctaText,
      ctaLink: opts.ctaLink,
      badge: opts.badge || 'Official Notification',
    });

    return await this.send(opts.to, opts.subject, html);
  }

  // Payment emails
  async sendPaymentProcessing(email: string, invoiceId: string) {
    const html = this.renderEmail({
      title: 'Payment Processing',
      body: `<p>Your payment for invoice <strong>${invoiceId}</strong> is currently being verified by our <strong>Payment Verification Team</strong>. Verification typically concludes within 30–45 minutes.</p>`,
      badge: 'Payment Status',
    });
    await this.send(email, 'Payment Processing Notice', html);
  }

  async sendPaymentApproved(email: string, invoiceId: string) {
    const html = this.renderEmail({
      title: 'Payment Confirmed & Verified',
      body: `<p>We are pleased to inform you that our <strong>Payment Verification Team</strong> has successfully confirmed and credited your payment for invoice <strong>${invoiceId}</strong>.</p><p>Your application workflow is now being processed.</p>`,
      badge: 'Payment Confirmed',
      ctaText: 'View Invoice & Status',
      ctaLink: `${this.brandWebsite}/dashboard`,
    });
    await this.send(email, 'Payment Confirmation Notice', html);
  }

  async sendPaymentDeclined(email: string, invoiceId: string, reason: string) {
    const html = this.renderEmail({
      title: 'Payment Verification Update',
      body: `<p>Our <strong>Payment Verification Team</strong> was unable to verify your recent submission for invoice <strong>${invoiceId}</strong>.</p><div style="background-color:#FFF5F5; border-left:4px solid #E53E3E; padding:12px 16px; margin:16px 0; border-radius:4px;"><p style="margin:0; color:#C53030; font-weight:500;">Reason: ${reason}</p></div><p>Please contact your assigned case officer or retry using an approved payment method.</p>`,
      badge: 'Action Required',
      ctaText: 'Access Billing Portal',
      ctaLink: `${this.brandWebsite}/dashboard`,
    });
    await this.send(email, 'Payment Verification Notice', html);
  }

  async sendWalletDepositConfirmation(email: string, amount: number) {
    const html = this.renderEmail({
      title: 'Deposit Credited Successfully',
      body: `<p>Your client wallet balance has been successfully credited with <strong>$${amount.toLocaleString()} USD</strong>.</p><p>You can allocate these funds toward government application fees, escrow requirements, and advisory retainers anytime.</p>`,
      badge: 'Wallet Credited',
      ctaText: 'View Wallet Balance',
      ctaLink: `${this.brandWebsite}/dashboard`,
    });
    await this.send(email, 'Deposit Confirmation Notice', html);
  }

  // Appointment emails
  async sendAppointmentConfirmation(email: string, appt: any) {
    const html = this.renderEmail({
      title: 'Consultation Appointment Confirmed',
      body: `<p>Your executive immigration consultation has been confirmed for <strong>${appt.scheduledAt}</strong>.</p><p>Your immigration advisor will connect with you through your scheduled meeting channel.</p>`,
      badge: 'Appointment Scheduled',
      ctaText: 'View Appointment Details',
      ctaLink: `${this.brandWebsite}/dashboard`,
    });
    await this.send(email, 'Consultation Appointment Confirmed', html);
  }

  async sendAppointmentCancellation(email: string, appt: any) {
    const html = this.renderEmail({
      title: 'Appointment Cancelled',
      body: `<p>Your consultation appointment scheduled for <strong>${appt.scheduledAt}</strong> has been cancelled.</p><p>If you wish to reschedule at your convenience, please visit your portal calendar.</p>`,
      badge: 'Appointment Cancelled',
      ctaText: 'Reschedule Appointment',
      ctaLink: `${this.brandWebsite}/dashboard`,
    });
    await this.send(email, 'Appointment Cancellation Notice', html);
  }

  // Referral emails
  async sendReferralApplied(email: string, code: string) {
    const html = this.renderEmail({
      title: 'VIP Referral Code Applied',
      body: `<p>You have successfully applied referral code <strong>${code}</strong> to your account profile.</p>`,
      badge: 'VIP Program',
    });
    await this.send(email, 'Referral Program Notice', html);
  }

  // Notification emails
  async sendAppointmentReminder(email: string, appt: any) {
    const html = this.renderEmail({
      title: 'Consultation Reminder',
      body: `<p>This is a courtesy reminder for your upcoming consultation scheduled on <strong>${appt.scheduledAt}</strong>.</p>`,
      badge: 'Reminder',
      ctaText: 'Join Meeting / Review Case',
      ctaLink: `${this.brandWebsite}/dashboard`,
    });
    await this.send(email, 'Upcoming Consultation Reminder', html);
  }

  // Verification emails
  async sendVerificationCode(email: string, code: string) {
    const html = this.renderEmail({
      title: 'Verify Your Email Address',
      body: `<p>Please use the 6-digit verification code below to verify your account registration on Global Citizen Solutions:</p>
             <div style="text-align:center; margin:24px 0;">
               <span style="font-size:32px; font-weight:800; letter-spacing:6px; color:${this.darkTeal}; background-color:#EDF2F7; padding:12px 28px; border-radius:8px; display:inline-block; font-family:Consolas, Monaco, monospace; border:1px solid #CBD5E0;">${code}</span>
             </div>
             <p style="color:${this.textMuted}; font-size:13px; text-align:center;">This one-time security code expires in 15 minutes.</p>`,
      badge: 'Security Verification',
      ctaText: 'Complete Verification',
      ctaLink: `${this.brandWebsite}/verify-email`,
    });
    await this.send(email, 'Global Citizen Solutions - Email Verification Code', html);
  }

  // Password reset emails
  async sendPasswordResetCode(email: string, code: string) {
    const html = this.renderEmail({
      title: 'Password Reset Verification',
      body: `<p>We received a request to reset your account password. Please enter the following 6-digit authentication code:</p>
             <div style="text-align:center; margin:24px 0;">
               <span style="font-size:32px; font-weight:800; letter-spacing:6px; color:${this.darkTeal}; background-color:#EDF2F7; padding:12px 28px; border-radius:8px; display:inline-block; font-family:Consolas, Monaco, monospace; border:1px solid #CBD5E0;">${code}</span>
             </div>
             <p style="color:${this.textMuted}; font-size:13px; text-align:center;">If you did not request this password reset, please contact support immediately.</p>`,
      badge: 'Security Notice',
      ctaText: 'Reset Password',
      ctaLink: `${this.brandWebsite}/login`,
    });
    await this.send(email, 'Global Citizen Solutions - Password Reset Code', html);
  }
}