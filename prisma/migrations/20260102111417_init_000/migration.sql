/*
  Warnings:

  - You are about to drop the column `status` on the `travel_plans` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "travel_plans" DROP COLUMN "status";

-- DropEnum
DROP TYPE "TravelStatus";
