import { MessagesService } from './messages.service';
export declare class MessagesController {
    private messagesService;
    constructor(messagesService: MessagesService);
    getConversation(req: any, otherId: string): Promise<{
        id: string;
        createdAt: Date;
        read: boolean;
        consultantId: string | null;
        content: string;
        senderId: string;
        receiverId: string;
    }[]>;
    getChatList(req: any): Promise<any[]>;
    send(req: any, body: {
        receiverId: string;
        content: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        read: boolean;
        consultantId: string | null;
        content: string;
        senderId: string;
        receiverId: string;
    }>;
}
