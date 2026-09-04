import { Controller, Get, Put, Body, UseGuards, Req, Post } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
    return this.usersService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  updateProfile(@Req() req, @Body() body: any) {
    return this.usersService.updateProfile(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboarding')
  completeOnboarding(@Req() req, @Body() dto: CompleteOnboardingDto) {
    return this.usersService.completeOnboarding(req.user.id, dto);
  }
}