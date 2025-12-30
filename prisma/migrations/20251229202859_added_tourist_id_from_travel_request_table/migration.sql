/*
  Warnings:

  - Added the required column `touristId` to the `TravelRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TravelRequest" ADD COLUMN     "touristId" INTEGER NOT NULL;
