import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../real-time/events.gateway';
import { NotificationsService } from '../notifications/notifications.service';
export declare class MessagesService {
    private prisma;
    private eventsGateway;
    private notificationsService;
    constructor(prisma: PrismaService, eventsGateway: EventsGateway, notificationsService: NotificationsService);
    sendMessage(senderId: string, receiverId: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        read: boolean;
        consultantId: string | null;
        content: string;
        senderId: string;
        receiverId: string;
    }>;
    getConversation(userId: string, otherId: string): Promise<{
        id: string;
        createdAt: Date;
        read: boolean;
        consultantId: string | null;
        content: string;
        senderId: string;
        receiverId: string;
    }[]>;
    getChatList(userId: string): Promise<any[]>;
}
