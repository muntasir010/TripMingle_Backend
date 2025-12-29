import prisma from "../../../shared/prisma";
import AppError from "../../../shared/AppError";
import httpStatus from "http-status";
import { RequestStatus } from "@prisma/client";

type SendRequestPayload = {
  travelPlanId: number;
};

type CreateTravelPlanPayload = {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelType: string;
  description?: string;
};

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

const sendRequest = async (userId: number, payload: SendRequestPayload) => {
  const travelPlanId = Number(payload.travelPlanId);
  console.log("travelPlanId:", travelPlanId, typeof travelPlanId);

  if (isNaN(travelPlanId)) {
    throw new AppError(400, "Invalid travelPlanId");
  }

  const travelPlan = await prisma.travelPlan.findUnique({
    where: { id: travelPlanId },
  });

  if (!travelPlan) {
    throw new AppError(404, "Travel plan not found");
  }

  // 3️⃣ Host
  const host = await prisma.host.findUnique({
    where: { id: travelPlan.hostId },
  });

  if (!host) {
    throw new AppError(404, "Host not found");
  }

  // 4️⃣ Already requested check (optional)
  const existingRequest = await prisma.travelRequest.findFirst({
    where: {
      requesterId: userId,
      travelPlanId,
    },
  });

  if (existingRequest) {
    throw new AppError(409, "You have already requested this travel plan");
  }

  // 5️⃣ Create Tour Request
  const travelRequest = await prisma.travelRequest.create({
    data: {
      requesterId: userId,
      travelPlanId: travelPlan.id,
      status: "PENDING",
    },
  });

  return travelRequest;
};

const getRequestsForHost = async (hostUserId: number) => {
  const host = await prisma.host.findUnique({
    where: { userId: hostUserId },
  });

  if (!host) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not a host");
  }

  const requests = await prisma.travelRequest.findMany({
    where: {
      travelPlan: {
        hostId: host.id,
      },
    },
    include: {
      requester: {
        select: {
          id: true,
          email: true,
        },
      },
      travelPlan: true,
    },
  });

  return requests;
};

const updateRequestStatus = async (
  hostUserId: number,
  requestId: number,
  status: RequestStatus
) => {
  const host = await prisma.host.findUnique({
    where: { userId: hostUserId },
  });

  if (!host) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not a host");
  }

  const request = await prisma.travelRequest.findUnique({
    where: { id: requestId },
    include: {
      travelPlan: true,
    },
  });

  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, "Request not found");
  }

  if (request.travelPlan.hostId !== host.id) {
    throw new AppError(httpStatus.FORBIDDEN, "Not your travel plan");
  }

  const updated = await prisma.travelRequest.update({
    where: { id: requestId },
    data: { status },
  });

  return updated;
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
  sendRequest,
  createTravelPlan,
  getPublicTravelPlans,
  getRequestsForHost,
  updateRequestStatus
};
