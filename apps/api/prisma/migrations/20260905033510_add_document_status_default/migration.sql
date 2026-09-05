/*
  Warnings:

  - The `status` column on the `Investment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Investment" DROP COLUMN "status",
ADD COLUMN     "status" "InvestmentStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "InvestmentDocument" ALTER COLUMN "status" SET DEFAULT 'PENDING_REVIEW';
