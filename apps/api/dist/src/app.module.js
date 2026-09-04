"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const countries_module_1 = require("./countries/countries.module");
const eligibility_module_1 = require("./eligibility/eligibility.module");
const cases_module_1 = require("./cases/cases.module");
const documents_module_1 = require("./documents/documents.module");
const payments_module_1 = require("./payments/payments.module");
const wallet_module_1 = require("./wallet/wallet.module");
const ai_module_1 = require("./ai/ai.module");
const appointments_module_1 = require("./appointments/appointments.module");
const admin_module_1 = require("./admin/admin.module");
const analytics_module_1 = require("./analytics/analytics.module");
const mail_module_1 = require("./mail/mail.module");
const public_module_1 = require("./public/public.module");
const real_time_module_1 = require("./real-time/real-time.module");
const consultant_module_1 = require("./consultant/consultant.module");
const notifications_module_1 = require("./notifications/notifications.module");
const referrals_module_1 = require("./referrals/referrals.module");
const schedule_1 = require("@nestjs/schedule");
const redis_module_1 = require("./redis/redis.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            countries_module_1.CountriesModule,
            eligibility_module_1.EligibilityModule,
            cases_module_1.CasesModule,
            documents_module_1.DocumentsModule,
            payments_module_1.PaymentsModule,
            wallet_module_1.WalletModule,
            ai_module_1.AiModule,
            appointments_module_1.AppointmentsModule,
            admin_module_1.AdminModule,
            analytics_module_1.AnalyticsModule,
            mail_module_1.MailModule,
            public_module_1.PublicModule,
            real_time_module_1.RealTimeModule,
            consultant_module_1.ConsultantModule,
            notifications_module_1.NotificationsModule,
            referrals_module_1.ReferralsModule,
            redis_module_1.RedisModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map