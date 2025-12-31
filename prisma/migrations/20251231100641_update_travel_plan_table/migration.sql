/*
  Warnings:

  - You are about to drop the column `touristId` on the `TravelRequest` table. All the data in the column will be lost.
  - Added the required column `capacity` to the `travel_plans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TravelRequest" DROP COLUMN "touristId";

-- AlterTable
ALTER TABLE "travel_plans" ADD COLUMN     "capacity" INTEGER NOT NULL;
