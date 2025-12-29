import prisma from "../../../shared/prisma";
import AppError from "../../../shared/AppError";
import httpStatus from "http-status";

type CreateTravelPlanPayload = {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelType: string;
  description?: string;
};

 const createTravelPlan = async (
  userId: number,
  payload: CreateTravelPlanPayload
) => {
  // 1️⃣ Host check
  const host = await prisma.host.findUnique({
    where: { userId },
  });

  if (!host) {
    throw new AppError(httpStatus.FORBIDDEN, "Only host can create travel plan");
  }

  const travelPlan = await prisma.travelPlan.create({
    data: {
      destination: payload.destination,
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate),
      budget: payload.budget,
      travelType: payload.travelType,
      description: payload.description,
      hostId: host.id,
    },
  });

  return travelPlan;
};

export const travelPlanService = {
    createTravelPlan,
};