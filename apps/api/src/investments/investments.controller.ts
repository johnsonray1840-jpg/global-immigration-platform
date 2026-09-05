import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { ReviewInvestmentDto } from './dto/review-investment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('investments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Post()
  @Roles(Role.CLIENT, Role.ADMIN, Role.SUPER_ADMIN)
  async create(@Request() req: any, @Body() createInvestmentDto: CreateInvestmentDto) {
    return this.investmentsService.create(req.user.userId, createInvestmentDto);
  }

  @Get()
  @Roles(Role.CLIENT, Role.ADMIN, Role.SUPER_ADMIN, Role.COMPLIANCE, Role.FINANCE)
  async findAll(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('programId') programId?: string,
  ) {
    const userId = req.user.userId;
    const userRole = req.user.role;
    
    if (userRole === Role.CLIENT) {
      return this.investmentsService.findByUser(userId, { status, type, programId });
    }
    
    return this.investmentsService.findAll({ status, type, programId });
  }

  @Get('programs')
  async getAllPrograms(@Query('countryId') countryId?: string, @Query('type') type?: string) {
    return this.investmentsService.getAllPrograms({ countryId, type });
  }

  @Get('programs/:slug')
  async getProgramBySlug(@Param('slug') slug: string) {
    return this.investmentsService.getProgramBySlug(slug);
  }

  @Get(':id')
  @Roles(Role.CLIENT, Role.ADMIN, Role.SUPER_ADMIN, Role.COMPLIANCE, Role.FINANCE)
  async findOne(@Request() req: any, @Param('id') id: string) {
    const userId = req.user.userId;
    const userRole = req.user.role;
    return this.investmentsService.findOne(id, userId, userRole);
  }

  @Patch(':id')
  @Roles(Role.CLIENT)
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateInvestmentDto: UpdateInvestmentDto,
  ) {
    return this.investmentsService.update(id, req.user.userId, updateInvestmentDto);
  }

  @Post(':id/documents')
  @Roles(Role.CLIENT)
  async uploadDocument(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { name: string; type: string; fileUrl: string },
  ) {
    return this.investmentsService.uploadDocument(id, req.user.userId, body);
  }

  @Get(':id/documents')
  @Roles(Role.CLIENT, Role.ADMIN, Role.SUPER_ADMIN, Role.COMPLIANCE, Role.DOCUMENT_VERIFIER)
  async getDocuments(@Request() req: any, @Param('id') id: string) {
    const userId = req.user.userId;
    const userRole = req.user.role;
    return this.investmentsService.getDocuments(id, userId, userRole);
  }

  @Patch(':id/review')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.COMPLIANCE)
  async reviewInvestment(
    @Param('id') id: string,
    @Body() reviewInvestmentDto: ReviewInvestmentDto,
    @Request() req: any,
  ) {
    return this.investmentsService.reviewInvestment(id, reviewInvestmentDto, req.user.userId);
  }

  @Delete(':id')
  @Roles(Role.CLIENT)
  async withdraw(@Request() req: any, @Param('id') id: string) {
    return this.investmentsService.withdraw(id, req.user.userId);
  }
}
