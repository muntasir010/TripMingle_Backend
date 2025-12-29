-- AddForeignKey
ALTER TABLE "TourRequest" ADD CONSTRAINT "TourRequest_travelPlanId_fkey" FOREIGN KEY ("travelPlanId") REFERENCES "travel_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
