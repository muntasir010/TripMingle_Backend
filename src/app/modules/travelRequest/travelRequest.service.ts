import httpStatus from "http-status";
import AppError from "../../../shared/AppError";
import prisma from "../../../shared/prisma";
import { RequestStatus } from "@prisma/client";

type SendRequestPayload = {
  travelPlanId: number;
};

const sendRequest = async (requesterId: number, travelPlanId: number) => {
  // 1️⃣ travel plan exists?
  const travelPlan = await prisma.travelPlan.findUnique({
    where: { id: travelPlanId },
  });

  if (!travelPlan) {
    throw new AppError(httpStatus.NOT_FOUND, "Travel plan not found");
  }

  // 2️⃣ prevent duplicate request
  const alreadyRequested = await prisma.travelRequest.findFirst({
    where: {
      requesterId,
      travelPlanId,
    },
  });

  if (alreadyRequested) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You already requested this travel plan"
    );
  }

  // 3️⃣ create request
  return prisma.travelRequest.create({
    data: {
      requesterId,
      travelPlanId,
    },
  });
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

export const TravelRequestService = {
  sendRequest,
  getRequestsForHost,
  updateRequestStatus,
};
