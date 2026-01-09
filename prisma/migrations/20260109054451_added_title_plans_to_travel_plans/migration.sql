/*
  Warnings:

  - Added the required column `title` to the `travel_plans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "travel_plans" ADD COLUMN     "title" TEXT NOT NULL;
