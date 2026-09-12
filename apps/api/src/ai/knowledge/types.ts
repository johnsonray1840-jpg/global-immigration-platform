export type KnowledgeCategoryCode =
  | 'GENERAL_IMMIGRATION'
  | 'PERMANENT_RESIDENCE'
  | 'CITIZENSHIP'
  | 'WORK_VISAS'
  | 'STUDENT_VISAS'
  | 'TOURIST_VISAS'
  | 'FAMILY_IMMIGRATION'
  | 'INVESTMENT_IMMIGRATION'
  | 'SCHOLARSHIPS'
  | 'DOCUMENTS'
  | 'ELIGIBILITY'
  | 'APPLICATION_PROCESS'
  | 'PAYMENTS'
  | 'CONSULTATIONS'
  | 'WEBSITE_HELP';

export type InformationSensitivity = 'STATIC_GENERAL' | 'TIME_SENSITIVE';

export interface TimeSensitiveMetadata {
  isTimeSensitive: boolean;
  source: string;
  country: string;
  program: string;
  effectiveDate: string;
  lastVerifiedDate: string;
  verificationStatus: 'VERIFIED_CURRENT' | 'PENDING_REVIEW' | 'REQUIRES_CONFIRMATION';
  disclaimer: string;
}

export interface TimeSensitivePolicyRecord {
  id: string;
  country: string;
  program: string;
  category:
    | 'FEES'
    | 'PROCESSING_TIMES'
    | 'VISA_REQUIREMENTS'
    | 'INVESTMENT_THRESHOLDS'
    | 'PROGRAM_AVAILABILITY'
    | 'GOVERNMENT_POLICY'
    | 'ELIGIBILITY_RULES';
  source: string;
  effectiveDate: string;
  lastVerifiedDate: string;
  data: Record<string, any>;
  notes?: string;
  verificationStatus: 'VERIFIED_CURRENT' | 'PENDING_REVIEW' | 'REQUIRES_CONFIRMATION';
}

export interface KnowledgeTopic {
  id: string;
  category: KnowledgeCategoryCode;
  title: string;
  keywords: string[];
  summary: string;
  content: string;
  sensitivity?: InformationSensitivity;
  timeSensitiveMeta?: Partial<TimeSensitiveMetadata>;
  keyPoints?: string[];
  requiredDocs?: string[];
  targetCountries?: string[];
  primaryRoute?: string;
  relatedRoutes?: Array<{ label: string; path: string }>;
  suggestedPrompts?: string[];
}

export interface KnowledgeCategory {
  code: KnowledgeCategoryCode;
  name: string;
  description: string;
  topics: KnowledgeTopic[];
}

