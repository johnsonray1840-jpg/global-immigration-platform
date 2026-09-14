import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CountriesModule } from './countries/countries.module';
import { EligibilityModule } from './eligibility/eligibility.module';
import { CasesModule } from './cases/cases.module';
import { DocumentsModule } from './documents/documents.module';
import { PaymentsModule } from './payments/payments.module';
import { WalletModule } from './wallet/wallet.module';
import { AiModule } from './ai/ai.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AdminModule } from './admin/admin.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { MailModule } from './mail/mail.module';
import { PublicModule } from './public/public.module';
import { RealTimeModule } from './real-time/real-time.module';
import { ConsultantModule } from './consultant/consultant.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReferralsModule } from './referrals/referrals.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule } from './redis/redis.module';
import { InvestmentsModule } from './investments/investments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 15, // Max 15 reqs/sec
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 60, // Max 60 reqs/10sec
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 200, // Max 200 reqs/min
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    CountriesModule,
    EligibilityModule,
    CasesModule,
    DocumentsModule,
    PaymentsModule,
    WalletModule,
    AiModule,
    AppointmentsModule,
    AdminModule,
    AnalyticsModule,
    MailModule,
    PublicModule,
    RealTimeModule,
    ConsultantModule,
    NotificationsModule,
    ReferralsModule,
    RedisModule,
    InvestmentsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}