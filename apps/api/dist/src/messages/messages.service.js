"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const events_gateway_1 = require("../real-time/events.gateway");
const notifications_service_1 = require("../notifications/notifications.service");
let MessagesService = class MessagesService {
    prisma;
    eventsGateway;
    notificationsService;
    constructor(prisma, eventsGateway, notificationsService) {
        this.prisma = prisma;
        this.eventsGateway = eventsGateway;
        this.notificationsService = notificationsService;
    }
    async sendMessage(senderId, receiverId, content) {
        const msg = await this.prisma.message.create({
            data: { senderId, receiverId, content },
        });
        this.eventsGateway.emitToUser(receiverId, 'new-message', msg);
        this.eventsGateway.emitToUser(senderId, 'new-message', msg);
        await this.notificationsService.createNotification(receiverId, 'New Message', 'You received a new message.', { messageId: msg.id });
        return msg;
    }
    async getConversation(userId, otherId) {
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
    async getChatList(userId) {
        const sent = await this.prisma.message.findMany({
            where: { senderId: userId },
            select: { receiverId: true, receiver: { select: { id: true, email: true } } },
        });
        const received = await this.prisma.message.findMany({
            where: { receiverId: userId },
            select: { senderId: true, sender: { select: { id: true, email: true } } },
        });
        const map = new Map();
        for (const item of sent) {
            if (item.receiver)
                map.set(item.receiverId, item.receiver);
        }
        for (const item of received) {
            if (item.sender)
                map.set(item.senderId, item.sender);
        }
        return Array.from(map.values());
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        events_gateway_1.EventsGateway,
        notifications_service_1.NotificationsService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map