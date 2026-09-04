-- AlterTable
ALTER TABLE "User" ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "migrationPurpose" TEXT,
ADD COLUMN     "preferredDestinations" TEXT[] DEFAULT ARRAY[]::TEXT[];
