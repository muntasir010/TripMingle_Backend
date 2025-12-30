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

// createTravelPlan(hostUserId) ✅
// getAllTravelPlans() ✅
// getSingleTravelPlan(id)✅
// getMyTravelPlans(hostUserId)
// updateTravelPlan(id)
// deleteTravelPlan(id)

const getPublicTravelPlans = async () => {
  const today = new Date();

  const plans = await prisma.travelPlan.findMany({
    where: {
      endDate: {
        gte: today,
      },
    },
    include: {
      host: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      startDate: "asc",
    },
  });

  return plans;
};

const getSingleTravelPlan = async (id: number) => {
  const travelPlan = await prisma.travelPlan.findUnique({
    where: { id },
    include: {
      host: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profilePhoto: true,
            },
          },
        },
      },
    },
  });

  if (!travelPlan) {
    throw new AppError(httpStatus.NOT_FOUND, "Travel plan not found");
  }

  return travelPlan;
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
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only host can create travel plan"
    );
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
  getPublicTravelPlans,
  getSingleTravelPlan,
};
