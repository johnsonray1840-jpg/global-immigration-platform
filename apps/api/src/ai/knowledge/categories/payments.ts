import { KnowledgeCategory } from '../types';
import { platformRoutes } from '../website-knowledge';

export const paymentsCategory: KnowledgeCategory = {
  code: 'PAYMENTS',
  name: 'Billing, Payments & Escrow Security',
  description: 'Accepted payment methods, bank wires, crypto escrow, milestone disbursements, and invoices',
  topics: [
    {
      id: 'payments-overview',
      category: 'PAYMENTS',
      title: 'Payment Methods, Escrow Protection & Deposit Instructions',
      keywords: ['payment methods', 'how to pay', 'deposit funds', 'bank wire', 'crypto payment', 'stripe', 'refund policy', 'escrow'],
      summary: 'Secure tier-1 payment rails for packages, retainers, and investor funds.',
      content: `Global Citizens Solution provides three institutional payment rails:

1. **Credit / Debit Cards (Stripe)**:
   - Instant processing with PCI-DSS Level 1 encryption.
   - Ideal for consultation bookings, initial retainers, and assessment fees.
2. **Bank Wire Transfers (SWIFT / SEPA / IBAN)**:
   - Institutional bank-to-bank escrow.
   - Navigate to **[Billing & Wallet](${platformRoutes.wallet.path})** to generate a dynamic invoice with your unique client reference ID.
   - Upload transfer receipt slip for priority verification within 1–2 business days.
3. **Cryptocurrency Escrow (BTC, ETH, USDT, USDC)**:
   - Dedicated single-use escrow wallet address with a 30-minute confirmation timer.
   - Ideal for international clients seeking fast borderless settlement with zero FX penalties.
   - Automatically credited upon blockchain confirmation.

**Escrow Policy**: Client funds are held in secure escrow and released according to defined case milestones.`,
      primaryRoute: platformRoutes.wallet.path,
      relatedRoutes: [
        { label: 'Manage Billing & Wallet', path: platformRoutes.wallet.path },
        { label: 'View Service Packages', path: platformRoutes.packages.path },
      ],
      suggestedPrompts: [
        'How do I deposit funds via bank wire?',
        'Can I pay using cryptocurrency like USDT or Bitcoin?',
        'Are my payments protected by escrow?',
      ],
    },
  ],
};
