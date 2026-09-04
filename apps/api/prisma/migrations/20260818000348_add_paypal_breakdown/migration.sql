-- AlterEnum
ALTER TYPE "PaymentMethodEnum" ADD VALUE 'PAYPAL';

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "breakdownJson" JSONB;
