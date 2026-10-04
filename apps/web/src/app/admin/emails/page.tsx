'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Mail,
  Send,
  Sparkles,
  History,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  User,
  RefreshCw,
  Eye,
  FileCheck,
  ShieldAlert,
  CreditCard,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Recipient {
  id: string;
  email: string;
  role: string;
  fullName: string;
}

interface EmailHistoryItem {
  id: string;
  sentAt: string;
  sentBy: string;
  details: {
    recipientEmail: string;
    recipientName?: string;
    subject: string;
    title?: string;
    messageSnippet?: string;
    badge?: string;
    ctaText?: string;
    ctaLink?: string;
    resendMessageId?: string;
  };
}

const EMAIL_TEMPLATES = [
  {
    name: 'Custom Email',
    icon: Sparkles,
    badge: 'Official Notice',
    subject: 'Important Update Regarding Your Global Immigration Portfolio',
    title: 'Immigration Advisory Notice',
    message: `We hope this message finds you well.\n\nOur legal and advisory team has updated your global residency documentation. Please review the details below or log into your client dashboard to proceed with the next steps.\n\nIf you have any questions or require personalized assistance, our dedicated immigration team is available to support you.`,
    ctaText: 'Access Client Portal',
    ctaLink: 'https://www.gcsworldwide.org/dashboard',
  },
  {
    name: 'Case Status Update',
    icon: FileCheck,
    badge: 'Case Milestone',
    subject: 'Milestone Update: Your Immigration Case Progress',
    title: 'Your Application Has Advanced to the Next Stage',
    message: `We are pleased to inform you that your immigration dossier has successfully cleared the initial compliance review and has been submitted to the corresponding immigration authorities.\n\nOur case management directorate is actively monitoring government processing timelines to ensure expeditious issuance.\n\nTrack your live case status and milestone achievements directly in your secure client portal.`,
    ctaText: 'View Case Progress',
    ctaLink: 'https://www.gcsworldwide.org/dashboard',
  },
  {
    name: 'Document Request',
    icon: ShieldAlert,
    badge: 'Action Required',
    subject: 'Action Required: Additional Documentation for Your Visa File',
    title: 'Submission of Verification Documents Requested',
    message: `To maintain the processing momentum of your application, our legal team requires supplementary verified documentation.\n\nPlease upload certified digital scans of the requested items (e.g. proof of address, notarized identification, or source of funds declaration) at your earliest convenience to avoid government processing delays.`,
    ctaText: 'Upload Documents Securely',
    ctaLink: 'https://www.gcsworldwide.org/dashboard',
  },
  {
    name: 'Payment & Wire Settlement',
    icon: CreditCard,
    badge: 'Billing & Escrow',
    subject: 'Invoice Settlement Notice: Global Citizen Solutions',
    title: 'Payment Instructions & Processing Update',
    message: `Please find the payment instructions and invoice confirmation for your ongoing immigration and advisory services.\n\nWe accept international wire transfers, credit cards, and major cryptocurrency settlements. Once settled, our finance team will promptly issue your official receipt and allocate application funds to your designated account.`,
    ctaText: 'View Invoice & Pay',
    ctaLink: 'https://www.gcsworldwide.org/dashboard',
  },
  {
    name: 'Consultation Scheduled',
    icon: Calendar,
    badge: 'Appointment',
    subject: 'Consultation Confirmed with Senior Immigration Counsel',
    title: 'Your Private Consultation is Confirmed',
    message: `Your upcoming strategy session with our senior immigration counsel has been scheduled.\n\nDuring this session, we will review your eligibility criteria, program selection, timeline, and document readiness.\n\nPlease ensure you have access to your video conference link 5 minutes prior to the start time.`,
    ctaText: 'View Appointment Details',
    ctaLink: 'https://www.gcsworldwide.org/dashboard',
  },
];

export default function AdminEmailsPage() {
  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [searchRecipient, setSearchRecipient] = useState('');
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);

  // Email form state
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [badge, setBadge] = useState('Official Notice');
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [ctaText, setCtaText] = useState('Access Client Portal');
  const [ctaLink, setCtaLink] = useState('https://www.gcsworldwide.org/dashboard');

  const [isSending, setIsSending] = useState(false);
  const [history, setHistory] = useState<EmailHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Initialize with the default template
  useEffect(() => {
    applyTemplate(EMAIL_TEMPLATES[0]);
    fetchRecipients();
  }, []);

  const fetchRecipients = async (q = '') => {
    try {
      const res = await api.get(`/admin/emails/recipients${q ? `?q=${encodeURIComponent(q)}` : ''}`);
      setRecipients(res.data);
    } catch (err) {
      console.error('Failed to load recipients list:', err);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await api.get('/admin/emails/history');
      setHistory(res.data);
    } catch (err) {
      toast.error('Failed to load email history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const applyTemplate = (template: typeof EMAIL_TEMPLATES[0]) => {
    setBadge(template.badge);
    setSubject(template.subject);
    setTitle(template.title);
    setMessage(template.message);
    setCtaText(template.ctaText);
    setCtaLink(template.ctaLink);
    toast.info(`Loaded "${template.name}" template`);
  };

  const selectRecipient = (user: Recipient) => {
    setRecipientEmail(user.email);
    setRecipientName(user.fullName || '');
    setShowRecipientDropdown(false);
    setSearchRecipient('');
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientEmail || !recipientEmail.includes('@')) {
      toast.error('Please specify a valid recipient email address');
      return;
    }
    if (!subject.trim()) {
      toast.error('Subject line is required');
      return;
    }
    if (!message.trim()) {
      toast.error('Email message content cannot be empty');
      return;
    }

    setIsSending(true);
    try {
      const res = await api.post('/admin/emails/send', {
        recipientEmail: recipientEmail.trim(),
        recipientName: recipientName.trim() || undefined,
        subject: subject.trim(),
        title: title.trim() || subject.trim(),
        message: message.trim(),
        badge: badge.trim() || undefined,
        ctaText: ctaText.trim() || undefined,
        ctaLink: ctaLink.trim() || undefined,
      });

      toast.success(res.data?.message || `Email successfully dispatched to ${recipientEmail}`);
      if (activeTab === 'history') {
        fetchHistory();
      }
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err.message || 'Failed to send email';
      toast.error(errMsg);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3.5 py-1 text-xs font-semibold text-accent mb-2">
            <Mail className="h-3.5 w-3.5" />
            Executive Communications
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">
            Custom Email Dispatcher
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Compose and transmit official, high-resolution branded emails with standard Global Citizen Solutions headers, signatures, and compliance disclosures from <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded text-foreground font-medium">support@gcsworldwide.org</span>.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex rounded-xl bg-card border border-border p-1 shadow-xs">
          <button
            onClick={() => setActiveTab('compose')}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all',
              activeTab === 'compose'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Send className="h-3.5 w-3.5" />
            Email Composer
          </button>
          <button
            onClick={() => {
              setActiveTab('history');
              fetchHistory();
            }}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all',
              activeTab === 'history'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <History className="h-3.5 w-3.5" />
            Dispatch History
          </button>
        </div>
      </div>

      {activeTab === 'compose' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Composer (Left - 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Quick Templates Bar */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-3">
                Quick Template Presets
              </span>
              <div className="flex flex-wrap gap-2">
                {EMAIL_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.name}
                    type="button"
                    onClick={() => applyTemplate(tmpl)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/60 hover:bg-accent/15 hover:border-accent/40 px-3 py-1.5 text-xs font-medium text-foreground transition-all"
                  >
                    <tmpl.icon className="h-3.5 w-3.5 text-accent" />
                    {tmpl.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSendEmail} className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5">
              <h2 className="text-base font-semibold text-foreground border-b border-border pb-3 flex items-center justify-between">
                <span>Message Configuration</span>
                <span className="text-xs font-normal text-muted-foreground">From: support@gcsworldwide.org</span>
              </h2>

              {/* Recipient Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Recipient Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="e.g. client@domain.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    required
                    className="bg-background border-border text-foreground pr-24"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowRecipientDropdown(!showRecipientDropdown)}
                      className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1 text-xs font-medium text-foreground hover:bg-accent/20 transition-colors"
                    >
                      <User className="h-3 w-3" />
                      Pick Client
                    </button>
                  </div>
                </div>

                {/* Recipient Dropdown Modal / Picker */}
                {showRecipientDropdown && (
                  <div className="rounded-xl border border-border bg-popover text-popover-foreground p-3 shadow-lg space-y-2 mt-1">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search registered clients..."
                        value={searchRecipient}
                        onChange={(e) => {
                          setSearchRecipient(e.target.value);
                          fetchRecipients(e.target.value);
                        }}
                        className="h-8 pl-8 text-xs bg-background"
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto divide-y divide-border">
                      {recipients.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-3">No clients found</p>
                      ) : (
                        recipients.map((user) => (
                          <div
                            key={user.id}
                            onClick={() => selectRecipient(user)}
                            className="flex items-center justify-between p-2 hover:bg-accent/15 rounded-lg cursor-pointer transition-colors"
                          >
                            <div>
                              <p className="text-xs font-medium text-foreground">{user.email}</p>
                              {user.fullName && <p className="text-[11px] text-muted-foreground">{user.fullName}</p>}
                            </div>
                            <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground font-mono">
                              {user.role}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Recipient Greeting Name & Badge */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Recipient Name (Optional Greeting)
                  </label>
                  <Input
                    placeholder="e.g. Jonathan Vance"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Category Badge
                  </label>
                  <Input
                    placeholder="e.g. Official Notice, Milestone"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
              </div>

              {/* Subject & Internal Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Subject Line <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Subject of the email"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="bg-background border-border text-foreground font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Header Heading (Inside Email Card)
                </label>
                <Input
                  placeholder="Main heading within the email"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-background border-border text-foreground"
                />
              </div>

              {/* Message Body */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Message Body <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-muted-foreground">Separate paragraphs with empty lines</span>
                </div>
                <Textarea
                  placeholder="Enter message body..."
                  rows={7}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="bg-background border-border text-foreground text-sm leading-relaxed"
                />
              </div>

              {/* Optional Call to Action Button */}
              <div className="rounded-xl border border-border/80 bg-background/50 p-4 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                  Optional Action Button (CTA)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">Button Label</label>
                    <Input
                      placeholder="e.g. Access Client Portal"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      className="h-9 text-xs bg-card"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">Target URL</label>
                    <Input
                      placeholder="e.g. https://www.gcsworldwide.org/dashboard"
                      value={ctaLink}
                      onChange={(e) => setCtaLink(e.target.value)}
                      className="h-9 text-xs bg-card"
                    />
                  </div>
                </div>
              </div>

              {/* Send Button */}
              <Button
                type="submit"
                disabled={isSending}
                className="w-full h-12 text-sm font-semibold bg-primary hover:bg-primary/90 text-white shadow-md flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Dispatching Email...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Transmit Official Email to Recipient
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Live Preview (Right - 5 cols) */}
          <div className="lg:col-span-5 sticky top-6 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-primary" />
                Live Inbox Rendering Preview
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">Standard Template</span>
            </div>

            {/* Email Canvas Simulation */}
            <div className="rounded-2xl border border-border/80 bg-[#F4F7F9] p-4 sm:p-5 shadow-lg overflow-hidden">
              <div className="rounded-xl border border-slate-200 bg-white shadow-md overflow-hidden text-slate-800">
                {/* Email Header */}
                <div className="bg-[#0A192F] p-4 sm:p-5 border-b-[3px] border-[#C9A96E] flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {/* Official Logo */}
                    <img
                      src="/logo.png"
                      alt="Global Citizen Solutions"
                      className="h-9 w-auto object-contain brightness-110"
                      onError={(e: any) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="text-white font-display text-sm font-bold tracking-tight">
                      Global<span className="text-[#C9A96E]">Citizens</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A96E]">
                    Advisory
                  </span>
                </div>

                {/* Email Body Content */}
                <div className="p-5 sm:p-6 space-y-4">
                  {badge && (
                    <span className="inline-block rounded-full bg-[#C9A96E]/20 border border-[#C9A96E]/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8F7239]">
                      {badge}
                    </span>
                  )}

                  <h3 className="font-display text-lg font-bold text-[#0A192F] leading-tight">
                    {title || subject || 'Subject Headline'}
                  </h3>

                  {recipientName && (
                    <p className="text-xs font-semibold text-[#0A192F]">
                      Dear {recipientName},
                    </p>
                  )}

                  <div className="text-xs text-slate-700 leading-relaxed space-y-2 whitespace-pre-line">
                    {message || 'Email message body will render here...'}
                  </div>

                  {/* CTA Button */}
                  {ctaText && ctaLink && (
                    <div className="pt-2 pb-1">
                      <div className="inline-block rounded-lg bg-gradient-to-r from-[#0B5D66] to-[#08434a] px-5 py-2.5 text-xs font-semibold text-white shadow-sm">
                        {ctaText} &rarr;
                      </div>
                    </div>
                  )}

                  {/* Advisor Signature */}
                  <div className="mt-6 pt-4 border-t border-slate-100 space-y-0.5">
                    <p className="text-xs font-semibold text-[#0A192F]">Global Citizen Solutions</p>
                    <p className="text-[11px] text-slate-500">Client Advisory & Communications Directorate</p>
                    <p className="text-[10px] text-[#0B5D66] font-medium">
                      support@gcsworldwide.org &bull; www.gcsworldwide.org
                    </p>
                  </div>
                </div>

                {/* Email Footer */}
                <div className="bg-[#F8FAFC] p-4 border-t border-slate-200 text-center space-y-1">
                  <p className="text-[10px] text-slate-500">
                    &copy; {new Date().getFullYear()} Global Citizen Solutions Worldwide. All rights reserved.
                  </p>
                  <p className="text-[9px] text-slate-400 leading-normal">
                    This communication contains confidential advisory information intended solely for the recipient.
                  </p>
                  <p className="text-[9px] text-slate-400">
                    London &bull; Lisbon &bull; Dubai &bull; Singapore &bull; Accra &bull; Miami
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* History Tab */
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Dispatched Email Records</h2>
              <p className="text-xs text-muted-foreground">Historical log of all custom communications transmitted from the admin console.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchHistory}
              disabled={loadingHistory}
              className="gap-1.5"
            >
              <RefreshCw className={cn('h-3.5 w-3.5', loadingHistory && 'animate-spin')} />
              Refresh
            </Button>
          </div>

          {loadingHistory ? (
            <div className="py-16 text-center">
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="mt-3 text-xs text-muted-foreground">Loading email dispatch history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="py-16 text-center">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <p className="mt-3 text-sm font-medium text-foreground">No custom emails dispatched yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Sent communications will automatically log here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-medium bg-muted/40">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Recipient</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Sender Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 text-muted-foreground whitespace-nowrap">
                        {new Date(item.sentAt).toLocaleString()}
                      </td>
                      <td className="p-3 font-medium text-foreground">
                        <div>{item.details?.recipientEmail}</div>
                        {item.details?.recipientName && (
                          <div className="text-[11px] text-muted-foreground">{item.details.recipientName}</div>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="inline-block rounded-full bg-accent/15 text-accent px-2 py-0.5 text-[10px] font-semibold">
                          {item.details?.badge || 'Notice'}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-foreground max-w-xs truncate">
                        {item.details?.subject}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {item.sentBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
