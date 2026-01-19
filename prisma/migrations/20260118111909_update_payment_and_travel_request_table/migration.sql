/*
  Warnings:

  - The primary key for the `Payment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `planId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `receiptUrl` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `tripId` on the `Payment` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the `SubscriptionPlan` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `seats` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `travelPlanId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `TravelRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seats` to the `TravelRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Payment_transactionId_key";

-- AlterTable
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_pkey",
DROP COLUMN "planId",
DROP COLUMN "receiptUrl",
DROP COLUMN "transactionId",
DROP COLUMN "tripId",
ADD COLUMN     "seats" INTEGER NOT NULL,
ADD COLUMN     "travelPlanId" INTEGER NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "amount" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Payment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Payment_id_seq";

-- AlterTable
ALTER TABLE "TravelRequest" ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "seats" INTEGER NOT NULL;

-- DropTable
DROP TABLE "SubscriptionPlan";
