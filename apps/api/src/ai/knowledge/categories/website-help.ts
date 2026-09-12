import { KnowledgeCategory } from '../types';
import { platformRoutes, websiteKnowledge } from '../website-knowledge';

export const websiteHelpCategory: KnowledgeCategory = {
  code: 'WEBSITE_HELP',
  name: 'Website Help & Navigation Assistance',
  description: 'Account management, 2FA, password reset, support channels, and portal walkthroughs',
  topics: [
    {
      id: 'website-navigation-guide',
      category: 'WEBSITE_HELP',
      title: 'Platform Navigation & Account Management',
      keywords: ['sign in', 'login', 'create account', 'register', 'forgot password', 'support contact', 'whatsapp number', 'email support'],
      summary: 'Direct guidance for accessing portal tools, account security, and official support.',
      content: `Global Citizens Solution provides a modern, secure portal for all your immigration needs:

- **Account Access**:
  - [Create Free Account](${platformRoutes.register.path}) - Start an application and unlock the Document Vault.
  - [Sign In](${platformRoutes.login.path}) - Access active cases, appointments, and billing.
  - [Forgot Password](${platformRoutes.forgotPassword.path}) - Instant password recovery.
- **Client Workspace**:
  - [Case Tracking](${platformRoutes.cases.path}) - Live stage milestones.
  - [Document Center](${platformRoutes.documents.path}) - Encrypted uploads with AI OCR.
  - [Billing & Wallet](${platformRoutes.wallet.path}) - Manage deposits and bank wires.
- **Contact & Support Channels**:
  - **Email**: \`${websiteKnowledge.contact.email}\`
  - **WhatsApp**: \`${websiteKnowledge.contact.whatsapp}\` ([Chat on WhatsApp](${websiteKnowledge.contact.whatsappUrl}))
  - **24/7 AI Concierge**: Always available right here in this chat window.`,
      primaryRoute: platformRoutes.home.path,
      relatedRoutes: [
        { label: 'Sign In', path: platformRoutes.login.path },
        { label: 'Register', path: platformRoutes.register.path },
        { label: 'FAQ Portal', path: platformRoutes.faq.path },
      ],
      suggestedPrompts: [
        'How do I create a free account?',
        'What is your official customer support email?',
        'How do I contact support via WhatsApp?',
      ],
    },
  ],
};
