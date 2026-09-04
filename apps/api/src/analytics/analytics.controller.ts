import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AnalyticsService } from './analytics.service';

@Controller('admin/analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN', 'FINANCE')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('overview')
  overview() {
    return this.analyticsService.getOverview();
  }

  @Get('country-demand')
  countryDemand() {
    return this.analyticsService.getCountryDemand();
  }

  @Get('activity')
  activity() {
    return this.analyticsService.getRecentActivity();
  }
}
