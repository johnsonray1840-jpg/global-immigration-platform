import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../real-time/events.gateway';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
    private notificationsService: NotificationsService,
  ) {}

  async sendMessage(senderId: string, receiverId: string, content: string) {
    const msg = await this.prisma.message.create({
      data: { senderId, receiverId, content },
    });

    this.eventsGateway.emitToUser(receiverId, 'new-message', msg);
    this.eventsGateway.emitToUser(senderId, 'new-message', msg);

    await this.notificationsService.createNotification(
      receiverId,
      'New Message',
      'You received a new message.',
      { messageId: msg.id },
    );

    return msg;
  }

  async getConversation(userId: string, otherId: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherId },
          { senderId: otherId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getChatList(userId: string) {
    // Get distinct users with whom the user has chatted
    const sent = await this.prisma.message.findMany({
      where: { senderId: userId },
      select: { receiverId: true, receiver: { select: { id: true, email: true } } },
    });
    const received = await this.prisma.message.findMany({
      where: { receiverId: userId },
      select: { senderId: true, sender: { select: { id: true, email: true } } },
    });

    const map = new Map<string, any>();
    for (const item of sent) {
      if (item.receiver) map.set(item.receiverId, item.receiver);
    }
    for (const item of received) {
      if (item.sender) map.set(item.senderId, item.sender);
    }
    return Array.from(map.values());
  }
}