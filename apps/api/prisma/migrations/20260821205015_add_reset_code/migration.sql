-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetCode" TEXT,
ADD COLUMN     "resetCodeExpires" TIMESTAMP(3),
ADD COLUMN     "verificationCode" TEXT,
ADD COLUMN     "verificationCodeExpires" TIMESTAMP(3);
