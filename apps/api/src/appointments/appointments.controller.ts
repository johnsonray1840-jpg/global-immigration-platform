import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  // Get available slots for a consultant on a date (public or user)
  @Get('availability/:consultantId')
  async getAvailability(@Param('consultantId') consultantId: string, @Query('date') date: string) {
    return this.appointmentsService.getAvailableSlots(consultantId, date);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    return this.appointmentsService.findAllForUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.appointmentsService.findOne(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  cancel(@Req() req, @Param('id') id: string) {
    return this.appointmentsService.cancel(req.user.id, id);
  }
}