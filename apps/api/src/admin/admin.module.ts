import { Module } from '@nestjs/common';
import { AdminCrudController } from './admin-crud.controller';
import { AdminPaymentMethodsController } from './admin-payment-methods.controller';
import { AdminWireAccountsController } from './admin-wire-accounts.controller';
import { AdminApprovalsController } from './admin-approvals.controller';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [PaymentsModule],   // <-- provides PaymentsService
  controllers: [
    AdminCrudController,
    AdminPaymentMethodsController,
    AdminWireAccountsController,
    AdminApprovalsController,
  ],
})
export class AdminModule {}