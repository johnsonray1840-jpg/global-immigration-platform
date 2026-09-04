import { Test, TestingModule } from '@nestjs/testing';
import { EligibilityService } from './eligibility.service';
import { PrismaService } from '../prisma/prisma.service';
import { EligibilityLabel } from '@prisma/client';

describe('EligibilityService', () => {
  let service: EligibilityService;

  const mockPrisma = {
    country: {
      findUnique: jest.fn(),
    },
    countryVisaRule: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EligibilityService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<EligibilityService>(EligibilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return LIKELY_ELIGIBLE for matching profile', async () => {
    mockPrisma.country.findUnique.mockResolvedValue({ id: 'US', name: 'United States', code: 'US' });
    mockPrisma.countryVisaRule.findMany.mockResolvedValue([
      {
        visaTypeId: 'TOURIST',
        visaType: { name: 'Tourist', category: 'TOURIST' },
        eligibilityJson: { minAge: 18, minIncome: 5000 },
        requiredDocs: [],
        governmentFee: 160,
        feeCurrency: 'USD',
        processingTimeMin: 15,
        processingTimeMax: 30,
        validityPeriod: 24,
        renewalAllowed: false,
      },
    ]);

    const result = await service.check({
      originCountryCode: 'NG',
      destinationCountryCode: 'US',
      age: 30,
      annualIncome: 10000,
    });

    expect(result.results).toHaveLength(1);
    expect(result.results[0].eligibilityLabel).toBe(EligibilityLabel.LIKELY_ELIGIBLE);
  });

  it('should return POTENTIALLY_ELIGIBLE for insufficient income', async () => {
    mockPrisma.country.findUnique.mockResolvedValue({ id: 'US', name: 'United States', code: 'US' });
    mockPrisma.countryVisaRule.findMany.mockResolvedValue([
      {
        visaTypeId: 'TOURIST',
        visaType: { name: 'Tourist', category: 'TOURIST' },
        eligibilityJson: { minAge: 18, minIncome: 5000 },
        requiredDocs: [],
        governmentFee: 160,
        feeCurrency: 'USD',
        processingTimeMin: 15,
        processingTimeMax: 30,
        validityPeriod: 24,
        renewalAllowed: false,
      },
    ]);

    const result = await service.check({
      originCountryCode: 'NG',
      destinationCountryCode: 'US',
      age: 30,
      annualIncome: 1000,
    });

    expect(result.results).toHaveLength(1);
    expect(result.results[0].eligibilityLabel).toBe(EligibilityLabel.POTENTIALLY_ELIGIBLE);
  });
});
