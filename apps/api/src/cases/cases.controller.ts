import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';

@Controller('cases')
export class CasesController {
  constructor(private casesService: CasesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() dto: CreateCaseDto) {
    return this.casesService.create(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    return this.casesService.findAllForUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.casesService.findOne(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(@Req() req, @Param('id') id: string, @Body() body: { status: string }) {
    return this.casesService.updateStatus(req.user.id, id, body.status);
  }
}