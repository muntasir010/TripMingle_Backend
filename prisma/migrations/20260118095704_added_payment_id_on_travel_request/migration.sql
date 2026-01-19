-- AlterEnum
ALTER TYPE "RequestStatus" ADD VALUE 'PAID';

-- AlterTable
ALTER TABLE "TravelRequest" ADD COLUMN     "paymentId" TEXT;
