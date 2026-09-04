import { EligibilityService } from './eligibility.service';
import { CheckEligibilityDto } from './dto/check-eligibility.dto';
export declare class EligibilityController {
    private eligibilityService;
    constructor(eligibilityService: EligibilityService);
    check(dto: CheckEligibilityDto): Promise<any>;
}
