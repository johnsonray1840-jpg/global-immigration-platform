import { AiService } from './ai.service';
import { ChatDto } from './dto/chat.dto';
import type { Response } from 'express';
export declare class AiController {
    private aiService;
    constructor(aiService: AiService);
    chat(dto: ChatDto): Promise<{
        reply: string;
        contextUsed: boolean;
    }>;
    streamChat(dto: ChatDto, res: Response): Promise<void>;
}
