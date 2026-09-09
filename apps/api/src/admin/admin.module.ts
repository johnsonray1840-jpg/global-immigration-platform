import { Module } from '@nestjs/common';
import { AdminCrudController } from './admin-crud.controller';
import { AdminPaymentMethodsController } from './admin-payment-methods.controller';
import { AdminWireAccountsController } from './admin-wire-accounts.controller';
import { AdminApprovalsController } from './admin-approvals.controller';
import { AdminCasesController } from './admin-cases.controller';
import { AdminDocumentsController } from './admin-documents.controller';
import { PaymentsModule } from '../payments/payments.module';
import { CasesModule } from '../cases/cases.module';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [PaymentsModule, CasesModule, DocumentsModule],
  controllers: [
    AdminCrudController,
    AdminPaymentMethodsController,
    AdminWireAccountsController,
    AdminApprovalsController,
    AdminCasesController,
    AdminDocumentsController,
  ],
})
export class AdminModule {}