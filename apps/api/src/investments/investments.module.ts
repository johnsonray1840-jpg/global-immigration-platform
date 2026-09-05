import { Module } from '@nestjs/common';
import { InvestmentsController } from './investments.controller';
import { InvestmentsService } from './investments.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [InvestmentsController],
  providers: [InvestmentsService],
  imports: [PrismaModule],
  exports: [InvestmentsService],
})
export class InvestmentsModule {}
