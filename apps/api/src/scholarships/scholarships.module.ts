import { Module } from '@nestjs/common';
import { ScholarshipsService } from './scholarships.service';
import { ScholarshipsController } from './scholarships.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ScholarshipsController],
  providers: [ScholarshipsService],
  imports: [PrismaModule],
  exports: [ScholarshipsService],
})
export class ScholarshipsModule {}
