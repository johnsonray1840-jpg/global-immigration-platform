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
exports.PublicController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
let PublicController = class PublicController {
    prisma;
    redis;
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    async getFaqs(category) {
        const cacheKey = `faqs:${category || 'all'}`;
        const cached = await this.redis.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const data = await this.prisma.faq.findMany({
            where: category ? { category } : undefined,
            orderBy: { order: 'asc' },
        });
        await this.redis.set(cacheKey, data, 300);
        return data;
    }
    async getPackages() {
        const cacheKey = 'packages';
        const cached = await this.redis.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const data = await this.prisma.servicePackage.findMany({
            where: { isActive: true },
            orderBy: { serviceFee: 'asc' },
        });
        await this.redis.set(cacheKey, data, 300);
        return data;
    }
    async getPackage(id) {
        const cacheKey = `package:${id}`;
        const cached = await this.redis.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const data = await this.prisma.servicePackage.findUnique({
            where: { id },
        });
        if (data)
            await this.redis.set(cacheKey, data, 300);
        return data;
    }
    async getScholarships(country, university, search) {
        const cacheKey = `scholarships:${country || ''}:${university || ''}:${search || ''}`;
        const cached = await this.redis.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const where = {};
        if (country)
            where.countryId = country;
        if (university)
            where.universityId = university;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        const data = await this.prisma.scholarship.findMany({
            where,
            include: { university: true, country: true },
            orderBy: { deadline: 'asc' },
        });
        await this.redis.set(cacheKey, data, 300);
        return data;
    }
    async getScholarship(id) {
        const cacheKey = `scholarship:${id}`;
        const cached = await this.redis.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const data = await this.prisma.scholarship.findUnique({
            where: { id },
            include: { university: true, country: true },
        });
        if (data)
            await this.redis.set(cacheKey, data, 300);
        return data;
    }
    async getConsultants() {
        const cacheKey = 'consultants';
        const cached = await this.redis.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const data = await this.prisma.consultantProfile.findMany({
            include: { user: { select: { email: true, profile: true } } },
        });
        await this.redis.set(cacheKey, data, 300);
        return data;
    }
    async getUniversities() {
        const cacheKey = 'universities';
        const cached = await this.redis.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const data = await this.prisma.university.findMany({
            include: { country: true, scholarships: true },
        });
        await this.redis.set(cacheKey, data, 300);
        return data;
    }
    async getOffices() {
        const cacheKey = 'offices';
        const cached = await this.redis.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const data = await this.prisma.office.findMany({
            include: { country: true },
            orderBy: { countryId: 'asc' },
        });
        await this.redis.set(cacheKey, data, 300);
        return data;
    }
    async getPartners() {
        const cacheKey = 'partners';
        const cached = await this.redis.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const data = await this.prisma.partner.findMany({
            orderBy: { name: 'asc' },
        });
        await this.redis.set(cacheKey, data, 300);
        return data;
    }
    async getPrograms() {
        const cacheKey = 'programs';
        const cached = await this.redis.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const data = await this.prisma.program.findMany({ orderBy: { title: 'asc' } });
        await this.redis.set(cacheKey, data, 300);
        return data;
    }
    async getProgram(slug) {
        const cacheKey = `program:${slug}`;
        const cached = await this.redis.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const data = await this.prisma.program.findUnique({ where: { slug } });
        if (data)
            await this.redis.set(cacheKey, data, 300);
        return data;
    }
    async getPage(slug) {
        const cacheKey = `page:${slug}`;
        const cached = await this.redis.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const data = await this.prisma.page.findUnique({ where: { slug } });
        if (data)
            await this.redis.set(cacheKey, data, 300);
        return data;
    }
    async getNews() {
        return this.prisma.news.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getNewsItem(id) {
        return this.prisma.news.findUnique({ where: { id } });
    }
    async subscribeNewsletter(body) {
        if (!body.email)
            return { success: false, message: 'Email required' };
        try {
            await this.prisma.subscriber.create({ data: { email: body.email } });
            return { success: true, message: 'Subscribed successfully' };
        }
        catch (error) {
            return { success: false, message: 'Email already subscribed or invalid' };
        }
    }
};
exports.PublicController = PublicController;
__decorate([
    (0, common_1.Get)('faqs'),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getFaqs", null);
__decorate([
    (0, common_1.Get)('packages'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getPackages", null);
__decorate([
    (0, common_1.Get)('packages/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getPackage", null);
__decorate([
    (0, common_1.Get)('scholarships'),
    __param(0, (0, common_1.Query)('country')),
    __param(1, (0, common_1.Query)('university')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getScholarships", null);
__decorate([
    (0, common_1.Get)('scholarships/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getScholarship", null);
__decorate([
    (0, common_1.Get)('consultants'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getConsultants", null);
__decorate([
    (0, common_1.Get)('universities'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getUniversities", null);
__decorate([
    (0, common_1.Get)('offices'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getOffices", null);
__decorate([
    (0, common_1.Get)('partners'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getPartners", null);
__decorate([
    (0, common_1.Get)('programs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getPrograms", null);
__decorate([
    (0, common_1.Get)('programs/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getProgram", null);
__decorate([
    (0, common_1.Get)('pages/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getPage", null);
__decorate([
    (0, common_1.Get)('news'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getNews", null);
__decorate([
    (0, common_1.Get)('news/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getNewsItem", null);
__decorate([
    (0, common_1.Post)('newsletter/subscribe'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "subscribeNewsletter", null);
exports.PublicController = PublicController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], PublicController);
//# sourceMappingURL=public.controller.js.map