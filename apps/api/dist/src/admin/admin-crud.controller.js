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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCrudController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
let AdminCrudController = class AdminCrudController {
    prisma;
    redis;
    allowedModels = [
        'user',
        'userProfile',
        'consultantProfile',
        'country',
        'visaType',
        'countryVisaRule',
        'case',
        'document',
        'checklistItem',
        'workspaceData',
        'roadmap',
        'appointment',
        'office',
        'invoice',
        'payment',
        'servicePackage',
        'scholarship',
        'university',
        'faq',
        'news',
        'page',
        'media',
        'partner',
        'testimonial',
        'successStory',
        'message',
        'notification',
        'referral',
        'auditLog',
        'aiDocument',
        'paymentMethod',
        'wireBankAccount',
        'userWireAccount',
        'cryptoPaymentSession',
        'wallet',
        'walletTransaction',
        'paymentApproval',
        'emailLog',
        'promotion',
        'program',
        'cryptoWallet',
        'subscriber',
    ];
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    getModel(model) {
        if (!this.allowedModels.includes(model)) {
            throw new common_1.BadRequestException('Invalid model');
        }
        return this.prisma[model];
    }
    async findAll(model, skip = '0', take = '50', orderBy, where) {
        const prismaModel = this.getModel(model);
        const args = {
            skip: Number(skip),
            take: Math.min(Number(take), 200),
        };
        if (orderBy) {
            args.orderBy = JSON.parse(orderBy);
        }
        if (where) {
            args.where = JSON.parse(where);
        }
        return prismaModel.findMany(args);
    }
    async findOne(model, id) {
        const prismaModel = this.getModel(model);
        return prismaModel.findUnique({ where: { id } });
    }
    async create(model, data, req) {
        const prismaModel = this.getModel(model);
        const result = await prismaModel.create({ data });
        await this.logAudit(req.user.id, 'CREATE', model, result.id, null, result);
        return result;
    }
    async update(model, id, data, req) {
        const prismaModel = this.getModel(model);
        const old = await prismaModel.findUnique({ where: { id } });
        if (!old)
            throw new common_1.BadRequestException('Record not found');
        const updated = await prismaModel.update({ where: { id }, data });
        await this.logAudit(req.user.id, 'UPDATE', model, id, old, updated);
        return updated;
    }
    async remove(model, id, req) {
        const prismaModel = this.getModel(model);
        const old = await prismaModel.findUnique({ where: { id } });
        if (!old)
            throw new common_1.BadRequestException('Record not found');
        const result = await prismaModel.delete({ where: { id } });
        await this.logAudit(req.user.id, 'DELETE', model, id, old, null);
        return result;
    }
    async logAudit(userId, action, entity, entityId, oldValue, newValue) {
        await this.prisma.auditLog.create({
            data: {
                userId,
                action,
                entity,
                entityId,
                oldValue: oldValue || undefined,
                newValue: newValue || undefined,
            },
        });
    }
};
exports.AdminCrudController = AdminCrudController;
__decorate([
    (0, common_1.Get)(':model'),
    __param(0, (0, common_1.Param)('model')),
    __param(1, (0, common_1.Query)('skip')),
    __param(2, (0, common_1.Query)('take')),
    __param(3, (0, common_1.Query)('orderBy')),
    __param(4, (0, common_1.Query)('where')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminCrudController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':model/:id'),
    __param(0, (0, common_1.Param)('model')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminCrudController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':model'),
    __param(0, (0, common_1.Param)('model')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminCrudController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':model/:id'),
    __param(0, (0, common_1.Param)('model')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminCrudController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':model/:id'),
    __param(0, (0, common_1.Param)('model')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminCrudController.prototype, "remove", null);
exports.AdminCrudController = AdminCrudController = __decorate([
    (0, common_1.Controller)('admin/crud'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], AdminCrudController);
//# sourceMappingURL=admin-crud.controller.js.map