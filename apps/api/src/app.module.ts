import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
})
export class AppModule {}