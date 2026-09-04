jest.mock('uuid', () => ({ v4: () => 'mock-uuid' }));
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { EventsGateway } from '../real-time/events.gateway';
import { NotificationsService } from '../notifications/notifications.service';

describe('PaymentsService', () => {
  let service: PaymentsService;

  const mockPrisma = {
    invoice: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    paymentApproval: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    wallet: {
      upsert: jest.fn(),
    },
    walletTransaction: {
      create: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockMail = {
    sendPaymentProcessing: jest.fn(),
    sendPaymentApproved: jest.fn(),
    sendPaymentDeclined: jest.fn(),
    sendWalletDepositConfirmation: jest.fn(),
  };

  const mockEvents = {
    emitToUser: jest.fn(),
  };

  const mockNotifications = {
    createNotification: jest.fn(),
  };

  const mockConfig = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ConfigService, useValue: mockConfig },
        { provide: MailService, useValue: mockMail },
        { provide: EventsGateway, useValue: mockEvents },
        { provide: NotificationsService, useValue: mockNotifications },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create invoice with breakdown', async () => {
    mockPrisma.invoice.create.mockResolvedValue({
      id: 'inv1', amount: 2500, currency: 'USD', status: 'PENDING', breakdownJson: {},
    });
    const result = await service.createInvoice('user1', { amount: 2500, breakdown: { serviceFee: 2500 } });
    expect(result.id).toBe('inv1');
  });


});
