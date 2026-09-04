export interface Program {
    slug: string;
    title: string;
    category: string;
    description: string;
    eligibility: string[];
    requirements: string[];
    documents: string[];
    governmentFees: string;
    serviceFees: string;
    processingTime: string;
    validity: string;
    renewal: string;
    commonMistakes: string[];
    approvalRate: string;
    faqs: {
        q: string;
        a: string;
    }[];
}
export declare const programs: Program[];
