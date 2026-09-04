import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReferralsService } from './referrals.service';

@Controller('referrals')
export class ReferralsController {
  constructor(private referralsService: ReferralsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('code')
  getCode(@Req() req) {
    return this.referralsService.getOrCreateReferralCode(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  getStats(@Req() req) {
    return this.referralsService.getReferralStats(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('apply')
  apply(@Req() req, @Body() body: { code: string }) {
    return this.referralsService.applyReferralCode(req.user.id, body.code);
  }
}
