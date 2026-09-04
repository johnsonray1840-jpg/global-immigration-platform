import { Controller, Post, Body } from '@nestjs/common';
import { EligibilityService } from './eligibility.service';
import { CheckEligibilityDto } from './dto/check-eligibility.dto';

@Controller('eligibility')
export class EligibilityController {
  constructor(private eligibilityService: EligibilityService) {}

  @Post('check')
  async check(@Body() dto: CheckEligibilityDto): Promise<any> { 
    return this.eligibilityService.check(dto);
  }
}