/*
  Warnings:

  - The values [SUCCESS] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING,CONFIRMED,CANCELLED] on the enum `TripStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "JoinStatus" AS ENUM ('PAID', 'CANCELLED');

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PENDING', 'PAID', 'FAILED');
ALTER TABLE "Payment" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TripStatus_new" AS ENUM ('UPCOMING', 'RUNNING', 'COMPLETED');
ALTER TABLE "trips" ALTER COLUMN "status" TYPE "TripStatus_new" USING ("status"::text::"TripStatus_new");
ALTER TYPE "TripStatus" RENAME TO "TripStatus_old";
ALTER TYPE "TripStatus_new" RENAME TO "TripStatus";
DROP TYPE "public"."TripStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "receiptUrl" TEXT,
ADD COLUMN     "tripId" INTEGER,
ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;
