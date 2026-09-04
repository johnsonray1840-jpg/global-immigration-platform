import { Controller, Get, Query, Param, Post, Body } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Controller()
export class PublicController {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  @Get('faqs')
  async getFaqs(@Query('category') category?: string) {
    const cacheKey = `faqs:${category || 'all'}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const data = await this.prisma.faq.findMany({
      where: category ? { category } : undefined,
      orderBy: { order: 'asc' },
    });
    await this.redis.set(cacheKey, data, 300);
    return data;
  }

  @Get('packages')
  async getPackages() {
    const cacheKey = 'packages';
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const data = await this.prisma.servicePackage.findMany({
      where: { isActive: true },
      orderBy: { serviceFee: 'asc' },
    });
    await this.redis.set(cacheKey, data, 300);
    return data;
  }

  @Get('packages/:id')
async getPackage(@Param('id') id: string) {
  const cacheKey = `package:${id}`;
  const cached = await this.redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const data = await this.prisma.servicePackage.findUnique({
    where: { id },
  });
  if (data) await this.redis.set(cacheKey, data, 300);
  return data;
}

  @Get('scholarships')
  async getScholarships(
    @Query('country') country?: string,
    @Query('university') university?: string,
    @Query('search') search?: string,
  ) {
    const cacheKey = `scholarships:${country || ''}:${university || ''}:${search || ''}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const where: any = {};
    if (country) where.countryId = country;
    if (university) where.universityId = university;
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

  @Get('scholarships/:id')
  async getScholarship(@Param('id') id: string) {
    const cacheKey = `scholarship:${id}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const data = await this.prisma.scholarship.findUnique({
      where: { id },
      include: { university: true, country: true },
    });
    if (data) await this.redis.set(cacheKey, data, 300);
    return data;
  }

  @Get('consultants')
  async getConsultants() {
    const cacheKey = 'consultants';
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const data = await this.prisma.consultantProfile.findMany({
      include: { user: { select: { email: true, profile: true } } },
    });
    await this.redis.set(cacheKey, data, 300);
    return data;
  }

  @Get('universities')
  async getUniversities() {
    const cacheKey = 'universities';
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const data = await this.prisma.university.findMany({
      include: { country: true, scholarships: true },
    });
    await this.redis.set(cacheKey, data, 300);
    return data;
  }

  @Get('offices')
  async getOffices() {
    const cacheKey = 'offices';
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const data = await this.prisma.office.findMany({
      include: { country: true },
      orderBy: { countryId: 'asc' },
    });
    await this.redis.set(cacheKey, data, 300);
    return data;
  }

  @Get('partners')
  async getPartners() {
    const cacheKey = 'partners';
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const data = await this.prisma.partner.findMany({
      orderBy: { name: 'asc' },
    });
    await this.redis.set(cacheKey, data, 300);
    return data;
  }

  @Get('programs')
  async getPrograms() {
    const cacheKey = 'programs';
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const data = await this.prisma.program.findMany({ orderBy: { title: 'asc' } });
    await this.redis.set(cacheKey, data, 300);
    return data;
  }

  @Get('programs/:slug')
  async getProgram(@Param('slug') slug: string) {
    const cacheKey = `program:${slug}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const data = await this.prisma.program.findUnique({ where: { slug } });
    if (data) await this.redis.set(cacheKey, data, 300);
    return data;
  }

  @Get('pages/:slug')
  async getPage(@Param('slug') slug: string) {
    const cacheKey = `page:${slug}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const data = await this.prisma.page.findUnique({ where: { slug } });
    if (data) await this.redis.set(cacheKey, data, 300);
    return data;
  }

  @Get('news')
  async getNews() {
    return this.prisma.news.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('news/:id')
  async getNewsItem(@Param('id') id: string) {
    return this.prisma.news.findUnique({ where: { id } });
  }

  @Post('newsletter/subscribe')
  async subscribeNewsletter(@Body() body: { email: string }) {
    if (!body.email) return { success: false, message: 'Email required' };
    try {
      await this.prisma.subscriber.create({ data: { email: body.email } });
      return { success: true, message: 'Subscribed successfully' };
    } catch (error) {
      return { success: false, message: 'Email already subscribed or invalid' };
    }
  }
}