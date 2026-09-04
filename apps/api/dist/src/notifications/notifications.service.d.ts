import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../real-time/events.gateway';
export declare class NotificationsService {
    private prisma;
    private eventsGateway;
    constructor(prisma: PrismaService, eventsGateway: EventsGateway);
    createNotification(userId: string, title: string, body: string, data?: any): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        body: string;
        read: boolean;
    }>;
    getNotifications(userId: string): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        body: string;
        read: boolean;
    }[]>;
    markAsRead(userId: string, notificationId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
