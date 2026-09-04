import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
export declare class AdminCrudController {
    private prisma;
    private redis;
    private allowedModels;
    constructor(prisma: PrismaService, redis: RedisService);
    private getModel;
    findAll(model: string, skip?: string, take?: string, orderBy?: string, where?: string): Promise<any>;
    findOne(model: string, id: string): Promise<any>;
    create(model: string, data: any, req: any): Promise<any>;
    update(model: string, id: string, data: any, req: any): Promise<any>;
    remove(model: string, id: string, req: any): Promise<any>;
    private logAudit;
}
