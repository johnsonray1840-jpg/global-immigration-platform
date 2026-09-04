import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
export declare class PublicController {
    private prisma;
    private redis;
    constructor(prisma: PrismaService, redis: RedisService);
    getFaqs(category?: string): Promise<any>;
    getPackages(): Promise<any>;
    getPackage(id: string): Promise<any>;
    getScholarships(country?: string, university?: string, search?: string): Promise<any>;
    getScholarship(id: string): Promise<any>;
    getConsultants(): Promise<any>;
    getUniversities(): Promise<any>;
    getOffices(): Promise<any>;
    getPartners(): Promise<any>;
    getPrograms(): Promise<any>;
    getProgram(slug: string): Promise<any>;
    getPage(slug: string): Promise<any>;
    getNews(): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        imageUrl: string | null;
        tags: string[];
        content: string;
        summary: string | null;
        published: boolean;
    }[]>;
    getNewsItem(id: string): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        imageUrl: string | null;
        tags: string[];
        content: string;
        summary: string | null;
        published: boolean;
    } | null>;
    subscribeNewsletter(body: {
        email: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
