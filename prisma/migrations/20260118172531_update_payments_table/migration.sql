-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- AlterTable
ALTER TABLE "TravelRequest" ALTER COLUMN "amount" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_travelPlanId_fkey" FOREIGN KEY ("travelPlanId") REFERENCES "travel_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
