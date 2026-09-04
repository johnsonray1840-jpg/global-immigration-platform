import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateInvestmentDto,
  UpdateInvestmentDto,
  CreateMilestoneDto,
  UpdateMilestoneDto,
  AddTransactionDto,
  UploadInvestmentDocumentDto,
  LogPerformanceDto,
} from './dto/create-investment.dto';

@Controller('investments')
@UseGuards(JwtAuthGuard)
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  // ============================================================
  // INVESTMENT PROGRAMS
  // ============================================================

  @Post()
  async createInvestment(@Request() req, @Body() dto: CreateInvestmentDto) {
    return this.investmentsService.createInvestment(req.user.userId, dto);
  }

  @Get()
  async findAll(@Request() req) {
    return this.investmentsService.findAllForUser(req.user.userId);
  }

  @Get('dashboard')
  async getDashboard(@Request() req) {
    return this.investmentsService.getInvestmentDashboard(req.user.userId);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.investmentsService.findOne(req.user.userId, id);
  }

  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateInvestmentDto,
  ) {
    return this.investmentsService.updateInvestment(req.user.userId, id, dto);
  }

  // ============================================================
  // MILESTONES
  // ============================================================

  @Post('milestones')
  async createMilestone(@Request() req, @Body() dto: CreateMilestoneDto) {
    return this.investmentsService.createMilestone(req.user.userId, dto);
  }

  @Put('milestones/:id')
  async updateMilestone(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateMilestoneDto,
  ) {
    return this.investmentsService.updateMilestone(req.user.userId, id, dto);
  }

  @Get(':investmentId/milestones/progress')
  async getMilestonesProgress(
    @Request() req,
    @Param('investmentId') investmentId: string,
  ) {
    return this.investmentsService.getMilestonesProgress(
      req.user.userId,
      investmentId,
    );
  }

  // ============================================================
  // TRANSACTIONS
  // ============================================================

  @Post('transactions')
  async addTransaction(@Request() req, @Body() dto: AddTransactionDto) {
    return this.investmentsService.addTransaction(req.user.userId, dto);
  }

  @Get(':investmentId/transactions')
  async getTransactions(
    @Request() req,
    @Param('investmentId') investmentId: string,
  ) {
    return this.investmentsService.getTransactions(req.user.userId, investmentId);
  }

  // ============================================================
  // DOCUMENTS
  // ============================================================

  @Post('documents')
  async uploadDocument(
    @Request() req,
    @Body() dto: UploadInvestmentDocumentDto,
  ) {
    return this.investmentsService.uploadDocument(req.user.userId, dto);
  }

  @Get(':investmentId/documents')
  async getDocuments(
    @Request() req,
    @Param('investmentId') investmentId: string,
  ) {
    return this.investmentsService.getDocuments(req.user.userId, investmentId);
  }

  @Put('documents/:id/verify')
  async verifyDocument(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { isVerified: boolean },
  ) {
    return this.investmentsService.verifyDocument(
      req.user.userId,
      id,
      body.isVerified,
    );
  }

  // ============================================================
  // PERFORMANCE TRACKING
  // ============================================================

  @Post('performance')
  async logPerformance(@Request() req, @Body() dto: LogPerformanceDto) {
    return this.investmentsService.logPerformance(req.user.userId, dto);
  }

  @Get(':investmentId/performance/history')
  async getPerformanceHistory(
    @Request() req,
    @Param('investmentId') investmentId: string,
  ) {
    return this.investmentsService.getPerformanceHistory(
      req.user.userId,
      investmentId,
    );
  }

  @Get(':investmentId/performance/chart')
  async getPerformanceChart(
    @Request() req,
    @Param('investmentId') investmentId: string,
  ) {
    return this.investmentsService.getPerformanceChart(
      req.user.userId,
      investmentId,
    );
  }

  // ============================================================
  // COMPLIANCE & RISK
  // ============================================================

  @Post(':investmentId/compliance')
  async addComplianceCheck(
    @Request() req,
    @Param('investmentId') investmentId: string,
    @Body() body: any,
  ) {
    return this.investmentsService.addComplianceCheck(
      req.user.userId,
      investmentId,
      body.checkData,
    );
  }

  // ============================================================
  // EXIT STRATEGY
  // ============================================================

  @Post(':investmentId/exit')
  async initiateExit(
    @Request() req,
    @Param('investmentId') investmentId: string,
    @Body() body: { reason?: string },
  ) {
    return this.investmentsService.initiateExit(
      req.user.userId,
      investmentId,
      body.reason,
    );
  }

  @Post(':investmentId/release')
  async releaseInvestment(
    @Request() req,
    @Param('investmentId') investmentId: string,
  ) {
    return this.investmentsService.releaseInvestment(req.user.userId, investmentId);
  }

  // ============================================================
  // REPORTS
  // ============================================================

  @Get(':investmentId/report')
  async generateReport(
    @Request() req,
    @Param('investmentId') investmentId: string,
  ) {
    return this.investmentsService.generateInvestmentReport(
      req.user.userId,
      investmentId,
    );
  }
}
