/*
  Warnings:

  - You are about to drop the `TourRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TourRequest" DROP CONSTRAINT "TourRequest_requesterId_fkey";

-- DropForeignKey
ALTER TABLE "TourRequest" DROP CONSTRAINT "TourRequest_travelPlanId_fkey";

-- DropTable
DROP TABLE "TourRequest";

-- CreateTable
CREATE TABLE "TravelRequest" (
    "id" SERIAL NOT NULL,
    "travelPlanId" INTEGER NOT NULL,
    "requesterId" INTEGER NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TravelRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TravelRequest_travelPlanId_requesterId_key" ON "TravelRequest"("travelPlanId", "requesterId");

-- AddForeignKey
ALTER TABLE "TravelRequest" ADD CONSTRAINT "TravelRequest_travelPlanId_fkey" FOREIGN KEY ("travelPlanId") REFERENCES "travel_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelRequest" ADD CONSTRAINT "TravelRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
