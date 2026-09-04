export type Language =
  | 'en' | 'fr' | 'es' | 'de' | 'zh' | 'ar' | 'pt' | 'ru' | 'ja' | 'ko'
  | 'it' | 'nl' | 'pl' | 'tr' | 'vi' | 'th' | 'hi' | 'id' | 'ms' | 'fil'
  | 'sw' | 'am' | 'ha' | 'yo' | 'ig' | 'zu' | 'af' | 'ur' | 'bn' | 'fa'
  | 'he' | 'el' | 'cs' | 'sk' | 'hu' | 'ro' | 'bg' | 'uk' | 'sr' | 'hr'
  | 'sv' | 'no' | 'da' | 'fi' | 'is';

type TranslationDictionary = {
  [key: string]: string;
};

// Helper to generate translations for all languages
const generateTranslations = (baseDict: TranslationDictionary): Record<Language, TranslationDictionary> => {
  const languages: Language[] = [
    'en', 'fr', 'es', 'de', 'zh', 'ar', 'pt', 'ru', 'ja', 'ko',
    'it', 'nl', 'pl', 'tr', 'vi', 'th', 'hi', 'id', 'ms', 'fil',
    'sw', 'am', 'ha', 'yo', 'ig', 'zu', 'af', 'ur', 'bn', 'fa',
    'he', 'el', 'cs', 'sk', 'hu', 'ro', 'bg', 'uk', 'sr', 'hr',
    'sv', 'no', 'da', 'fi', 'is'
  ];
  
  const result: Record<Language, TranslationDictionary> = {} as any;
  
  languages.forEach(lang => {
    result[lang] = { ...baseDict };
  });
  
  return result;
};

const baseTranslations: TranslationDictionary = {
  // Navigation
  'nav.home': 'Home',
  'nav.countries': 'Countries',
  'nav.programs': 'Programs',
  'nav.eligibility': 'Eligibility',
  'nav.packages': 'Packages',
  'nav.about': 'About',
  'nav.faq': 'FAQ',
  'nav.news': 'News',
  'nav.partners': 'Partners',
  'nav.scholarships': 'Scholarships',
  'nav.signin': 'Sign In',
  'nav.getstarted': 'Get Started',
  'nav.dashboard': 'Dashboard',
  'nav.profile': 'Profile',
  'nav.settings': 'Settings',
  'nav.logout': 'Logout',
  'nav.messages': 'Messages',
  'nav.documents': 'Documents',
  'nav.appointments': 'Appointments',
  'nav.payments': 'Payments',
  'nav.wallet': 'Wallet',
  'nav.referral': 'Referral',
  
  // Hero Section
  'hero.badge': 'Government-Approved Immigration Services',
  'hero.title': 'Your Gateway to Global Freedom',
  'hero.subtitle': 'Expert guidance for visas, permanent residence, citizenship, and investment immigration.',
  'hero.from': 'From',
  'hero.to': 'To',
  'hero.purpose': 'Purpose',
  'hero.search': 'Search',
  'hero.exploreOptions': 'Explore Immigration Options',
  'hero.checkEligibility': 'Check Your Eligibility',
  'hero.journeyTitle': 'Your Journey Beyond Borders.',
  'hero.journeySubtitle': 'Expert immigration pathways for individuals, families, students, investors and professionals seeking opportunities around the world.',
  
  // Stats Section
  'stats.countries': 'Countries Served',
  'stats.cases': 'Successful Cases',
  'stats.approval': 'Approval Rate',
  'stats.years': 'Years Experience',
  
  // Common UI
  'common.loading': 'Loading...',
  'common.error': 'Error',
  'common.success': 'Success',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.view': 'View',
  'common.submit': 'Submit',
  'common.back': 'Back',
  'common.next': 'Next',
  'common.previous': 'Previous',
  'common.close': 'Close',
  'common.confirm': 'Confirm',
  'common.required': 'Required',
  'common.optional': 'Optional',
  
  // Footer
  'footer.rights': 'All rights reserved.',
  'footer.privacy': 'Privacy Policy',
  'footer.terms': 'Terms of Service',
  'footer.cookies': 'Cookie Policy',
  'footer.disclaimer': 'Disclaimer',
  'footer.contact': 'Contact Us',
  'footer.followUs': 'Follow Us',
  
  // CTA Section
  'cta.title': 'Ready to Start Your Journey?',
  'cta.subtitle': 'Book a consultation with our expert team today.',
  'cta.button': 'Book Consultation',
  
  // FAQ Section
  'faq.title': 'Frequently Asked Questions',
  'faq.subtitle': 'Find answers to common questions about our services.',
  
  // Programs Section
  'programs.title': 'Immigration Programs',
  'programs.subtitle': 'Discover pathways tailored to your goals.',
  'programs.learnMore': 'Learn More',
  
  // Packages Section
  'packages.title': 'Service Packages',
  'packages.subtitle': 'Choose the right package for your needs.',
  'packages.popular': 'Popular',
  'packages.select': 'Select Package',
  
  // Success Stories
  'successStories.title': 'Success Stories',
  'successStories.subtitle': 'Read about our clients\' journeys.',
  
  // Offices
  'offices.title': 'Our Offices',
  'offices.subtitle': 'Visit us at one of our locations worldwide.',
  
  // Partners
  'partners.title': 'Our Partners',
  'partners.subtitle': 'Trusted by leading organizations.',
  
  // Map Section
  'map.title': 'Global Presence',
  'map.subtitle': 'Serving clients across the globe.',
  
  // Auth
  'auth.login': 'Login',
  'auth.register': 'Register',
  'auth.forgotPassword': 'Forgot Password',
  'auth.verifyEmail': 'Verify Email',
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.name': 'Name',
  'auth.phone': 'Phone',
  'auth.rememberMe': 'Remember Me',
  'auth.noAccount': "Don't have an account?",
  'auth.haveAccount': 'Already have an account?',
  'auth.signup': 'Sign Up',
  'auth.sendResetLink': 'Send Reset Link',
  'auth.backToLogin': 'Back to Login',
  'auth.checkEmail': 'Check your email for verification instructions.',
  
  // Dashboard
  'dashboard.title': 'Dashboard',
  'dashboard.welcome': 'Welcome back',
  'dashboard.overview': 'Overview',
  'dashboard.recentActivity': 'Recent Activity',
  'dashboard.upcomingAppointments': 'Upcoming Appointments',
  'dashboard.pendingDocuments': 'Pending Documents',
  
  // Cases
  'cases.title': 'My Cases',
  'cases.status': 'Status',
  'cases.progress': 'Progress',
  'cases.details': 'Case Details',
  
  // Documents
  'documents.title': 'Documents',
  'documents.upload': 'Upload Document',
  'documents.type': 'Document Type',
  'documents.status': 'Status',
  'documents.uploaded': 'Uploaded',
  'documents.pending': 'Pending Review',
  'documents.approved': 'Approved',
  'documents.rejected': 'Rejected',
  
  // Appointments
  'appointments.title': 'Appointments',
  'appointments.book': 'Book Appointment',
  'appointments.date': 'Date',
  'appointments.time': 'Time',
  'appointments.consultant': 'Consultant',
  'appointments.notes': 'Notes',
  
  // Payments
  'payments.title': 'Payments',
  'payments.amount': 'Amount',
  'payments.method': 'Payment Method',
  'payments.history': 'Payment History',
  'payments.invoice': 'Invoice',
  
  // Wallet
  'wallet.title': 'Wallet',
  'wallet.balance': 'Balance',
  'wallet.deposit': 'Deposit',
  'wallet.withdraw': 'Withdraw',
  'wallet.transactions': 'Transactions',
  
  // Messages
  'messages.title': 'Messages',
  'messages.send': 'Send Message',
  'messages.type': 'Type a message...',
  
  // Profile
  'profile.title': 'Profile Settings',
  'profile.personalInfo': 'Personal Information',
  'profile.contactInfo': 'Contact Information',
  'profile.security': 'Security',
  'profile.twoFactor': 'Two-Factor Authentication',
  
  // Admin
  'admin.title': 'Admin Panel',
  'admin.users': 'Users',
  'admin.consultants': 'Consultants',
  'admin.countries': 'Countries',
  'admin.payments': 'Payments',
  'admin.approvals': 'Approvals',
  'admin.analytics': 'Analytics',
  'admin.settings': 'Settings',
  
  // Eligibility
  'eligibility.title': 'Check Your Eligibility',
  'eligibility.nationality': 'Nationality',
  'eligibility.destination': 'Destination Country',
  'eligibility.purpose': 'Purpose of Travel',
  'eligibility.results': 'Eligibility Results',
  'eligibility.check': 'Check Now',
  
  // Countries
  'countries.title': 'Countries',
  'countries.search': 'Search countries...',
  'countries.visaFree': 'Visa-Free Access',
  'countries.requirements': 'Requirements',
  
  // Accessibility
  'accessibility.title': 'Accessibility Options',
  'accessibility.fontSize': 'Font Size',
  'accessibility.contrast': 'High Contrast',
  'accessibility.screenReader': 'Screen Reader Support',
  
  // Notifications
  'notifications.title': 'Notifications',
  'notifications.markRead': 'Mark as Read',
  'notifications.clear': 'Clear All',
  'notifications.noNotifications': 'No notifications',
  
  // Referral
  'referral.title': 'Refer a Friend',
  'referral.link': 'Your Referral Link',
  'referral.copy': 'Copy Link',
  'referral.earnings': 'Referral Earnings',
  'referral.share': 'Share',
  
  // Consultant
  'consultant.title': 'Consultant Dashboard',
  'consultant.cases': 'My Cases',
  'consultant.schedule': 'Schedule',
  'consultant.workspace': 'Workspace',
  
  // Purposes
  'purpose.permanent-residence': 'Permanent Residence',
  'purpose.citizenship': 'Citizenship',
  'purpose.work': 'Work',
  'purpose.study': 'Study',
  'purpose.investment': 'Investment',
  'purpose.family': 'Family Reunification',
  'purpose.tourist': 'Tourist Visa',
  'purpose.business': 'Business Visa',
  
  // Status
  'status.pending': 'Pending',
  'status.approved': 'Approved',
  'status.rejected': 'Rejected',
  'status.inProgress': 'In Progress',
  'status.completed': 'Completed',
  'status.draft': 'Draft',
  'status.submitted': 'Submitted',
  'status.underReview': 'Under Review',
};

// Generate complete translations object - all languages start with English
export const translations: Record<Language, TranslationDictionary> = generateTranslations(baseTranslations);