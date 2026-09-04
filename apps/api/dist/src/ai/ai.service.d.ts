import { PrismaService } from '../prisma/prisma.service';
import type { Response } from 'express';
export declare class AiService {
    private prisma;
    private hf;
    constructor(prisma: PrismaService);
    chat(message: string, history?: Array<{
        role: 'user' | 'assistant';
        content: string;
    }>, language?: string): Promise<{
        reply: string;
        contextUsed: boolean;
    }>;
    streamChat(message: string, history: Array<{
        role: 'user' | 'assistant';
        content: string;
    }>, language: string, res: Response): Promise<void>;
    private retrieveContext;
    private localFallback;
}
