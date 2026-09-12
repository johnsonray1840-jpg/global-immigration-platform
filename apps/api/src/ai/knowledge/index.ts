import { KnowledgeCategory, KnowledgeTopic, KnowledgeCategoryCode } from './types';
import { generalImmigrationCategory } from './categories/general-immigration';
import { permanentResidenceCategory } from './categories/permanent-residence';
import { citizenshipCategory } from './categories/citizenship';
import { workVisasCategory } from './categories/work-visas';
import { studentVisasCategory } from './categories/student-visas';
import { touristVisasCategory } from './categories/tourist-visas';
import { familyImmigrationCategory } from './categories/family-immigration';
import { investmentImmigrationCategory } from './categories/investment-immigration';
import { scholarshipsCategory } from './categories/scholarships';
import { documentsCategory } from './categories/documents';
import { eligibilityCategory } from './categories/eligibility';
import { applicationProcessCategory } from './categories/application-process';
import { paymentsCategory } from './categories/payments';
import { consultationsCategory } from './categories/consultations';
import { websiteHelpCategory } from './categories/website-help';

export * from './types';
export * from './website-knowledge';
export * from './faq-80-questions';
export * from './conversation-state';

export const allKnowledgeCategories: KnowledgeCategory[] = [
  generalImmigrationCategory,     // A. GENERAL IMMIGRATION
  permanentResidenceCategory,     // B. PERMANENT RESIDENCE
  citizenshipCategory,            // C. CITIZENSHIP
  workVisasCategory,              // D. WORK VISAS
  studentVisasCategory,           // E. STUDENT VISAS
  touristVisasCategory,           // F. TOURIST VISAS
  familyImmigrationCategory,      // G. FAMILY IMMIGRATION
  investmentImmigrationCategory,  // H. INVESTMENT IMMIGRATION
  scholarshipsCategory,           // I. SCHOLARSHIPS
  documentsCategory,              // J. DOCUMENTS
  eligibilityCategory,            // K. ELIGIBILITY
  applicationProcessCategory,     // L. APPLICATION PROCESS
  paymentsCategory,               // M. PAYMENTS
  consultationsCategory,          // N. CONSULTATIONS
  websiteHelpCategory,            // O. WEBSITE HELP
];

export function getAllTopics(): KnowledgeTopic[] {
  return allKnowledgeCategories.flatMap((c) => c.topics);
}

export function findCategoryByCode(code: KnowledgeCategoryCode): KnowledgeCategory | undefined {
  return allKnowledgeCategories.find((c) => c.code === code);
}

export function searchKnowledge(query: string, maxResults = 3): KnowledgeTopic[] {
  const q = query.toLowerCase();
  const allTopics = getAllTopics();

  const scored = allTopics.map((topic) => {
    let score = 0;
    if (topic.title.toLowerCase().includes(q)) score += 10;
    if (topic.keywords.some((k) => q.includes(k.toLowerCase()) || k.toLowerCase().includes(q))) score += 8;
    if (topic.summary.toLowerCase().includes(q)) score += 4;
    if (topic.content.toLowerCase().includes(q)) score += 2;
    return { topic, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((item) => item.topic);
}
