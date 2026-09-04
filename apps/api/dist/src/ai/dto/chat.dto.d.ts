export declare class ChatDto {
    message: string;
    history?: Array<{
        role: 'user' | 'assistant';
        content: string;
    }>;
    language?: string;
}
