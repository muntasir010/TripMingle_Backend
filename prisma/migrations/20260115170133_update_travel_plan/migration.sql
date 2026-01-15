/*
  Warnings:

  - Added the required column `totalCapacity` to the `travel_plans` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "travel_plans" ADD COLUMN     "joinedCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "PlanStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "totalCapacity" INTEGER NOT NULL;
