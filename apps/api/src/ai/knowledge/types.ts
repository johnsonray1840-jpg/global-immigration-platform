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

export interface KnowledgeTopic {
  id: string;
  category: KnowledgeCategoryCode;
  title: string;
  keywords: string[];
  summary: string;
  content: string;
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
