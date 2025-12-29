/*
  Warnings:

  - You are about to drop the column `userId` on the `travel_plans` table. All the data in the column will be lost.
  - Added the required column `hostId` to the `travel_plans` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "travel_plans" DROP CONSTRAINT "travel_plans_userId_fkey";

-- AlterTable
ALTER TABLE "travel_plans" DROP COLUMN "userId",
ADD COLUMN     "hostId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "travel_plans" ADD CONSTRAINT "travel_plans_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
