/*
  Warnings:

  - Added the required column `status` to the `travel_plans` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TravelStatus" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED');

-- AlterTable
ALTER TABLE "travel_plans" ADD COLUMN     "status" "TravelStatus" NOT NULL;
