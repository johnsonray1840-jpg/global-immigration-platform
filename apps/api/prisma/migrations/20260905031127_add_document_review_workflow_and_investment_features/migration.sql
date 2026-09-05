-- CreateEnum
CREATE TYPE "InvestmentStatus" AS ENUM ('PENDING', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'COMPLETED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "InvestmentType" AS ENUM ('REAL_ESTATE', 'GOVERNMENT_FUND', 'BUSINESS_INVESTMENT', 'DONATION', 'BOND_PURCHASE');

-- AlterEnum
ALTER TYPE "DocumentStatus" ADD VALUE 'PENDING_REVIEW';

-- CreateTable
CREATE TABLE "Investment" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "programId" TEXT,
    "type" "InvestmentType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "DocumentStatus" NOT NULL,
    "transactionRef" TEXT,
    "propertyDetails" JSONB,
    "fundDetails" JSONB,
    "businessDetails" JSONB,
    "donationDetails" JSONB,
    "bondDetails" JSONB,
    "timeline" JSONB,
    "notes" TEXT,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentProgram" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "investmentType" "InvestmentType" NOT NULL,
    "minAmount" DOUBLE PRECISION NOT NULL,
    "maxAmount" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "governmentFee" DOUBLE PRECISION,
    "processingFee" DOUBLE PRECISION,
    "dueDiligenceFee" DOUBLE PRECISION,
    "legalFee" DOUBLE PRECISION,
    "totalEstimatedCost" DOUBLE PRECISION NOT NULL,
    "processingTimeMin" INTEGER,
    "processingTimeMax" INTEGER,
    "eligibility" JSONB NOT NULL,
    "requirements" JSONB NOT NULL,
    "benefits" TEXT[],
    "restrictions" TEXT[],
    "taxImplications" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "popularityRank" INTEGER NOT NULL DEFAULT 0,
    "approvalRate" DOUBLE PRECISION,
    "imageUrl" TEXT,
    "brochureUrl" TEXT,
    "videoUrl" TEXT,
    "faqs" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestmentProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentDocument" (
    "id" TEXT NOT NULL,
    "investmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "status" "DocumentStatus" NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "notes" TEXT,

    CONSTRAINT "InvestmentDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentTimeline" (
    "id" TEXT NOT NULL,
    "investmentId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "expectedDate" TIMESTAMP(3),
    "actualDate" TIMESTAMP(3),
    "documents" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvestmentTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentProgram_slug_key" ON "InvestmentProgram"("slug");

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_programId_fkey" FOREIGN KEY ("programId") REFERENCES "InvestmentProgram"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentProgram" ADD CONSTRAINT "InvestmentProgram_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentDocument" ADD CONSTRAINT "InvestmentDocument_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "Investment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentTimeline" ADD CONSTRAINT "InvestmentTimeline_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "Investment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
