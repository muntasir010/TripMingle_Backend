-- DropForeignKey
ALTER TABLE "TourRequest" DROP CONSTRAINT "TourRequest_travelPlanId_fkey";

-- DropForeignKey
ALTER TABLE "hosts" DROP CONSTRAINT "hosts_userId_fkey";

-- DropForeignKey
ALTER TABLE "travel_plans" DROP CONSTRAINT "travel_plans_hostId_fkey";

-- AddForeignKey
ALTER TABLE "travel_plans" ADD CONSTRAINT "travel_plans_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "hosts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hosts" ADD CONSTRAINT "hosts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
