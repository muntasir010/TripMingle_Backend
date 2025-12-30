import httpStatus from "http-status";
import AppError from "../../../shared/AppError";
import prisma from "../../../shared/prisma";
import { RequestStatus } from "@prisma/client";

type SendRequestPayload = {
  travelPlanId: number;
};

// const endRequest = async (userId: number, payload: SendRequestPayload) => {
//   const travelPlanId = Number(payload.travelPlanId);
//   console.log("travelPlanId:", travelPlanId, typeof travelPlanId);

//   if (isNaN(travelPlanId)) {
//     throw new AppError(400, "Invalid travelPlanId");
//   }

//   const travelPlan = await prisma.travelPlan.findUnique({
//     where: { id: travelPlanId },
//   });

//   if (!travelPlan) {
//     throw new AppError(404, "Travel plan not found");
//   }

//   // 3️⃣ Host
//   const host = await prisma.host.findUnique({
//     where: { id: travelPlan.hostId },
//   });

//   if (!host) {
//     throw new AppError(404, "Host not found");
//   }

//   // 4️⃣ Already requested check (optional)
//   const existingRequest = await prisma.travelRequest.findFirst({
//     where: {
//       requesterId: userId,
//       travelPlanId,
//     },
//   });

//   if (existingRequest) {
//     throw new AppError(409, "You have already requested this travel plan");
//   }

//   // 5️⃣ Create Tour Request
//   const travelRequest = await prisma.travelRequest.create({
//     data: {
//       requesterId: userId,
//       travelPlanId: travelPlan.id,
//       status: "PENDING",
//     },
//   });

//   return travelRequest;
// };

// const sendRequest = async (touristId: number, travelPlanId: number) => {
//   // 1️⃣ check travel plan exists
//   const plan = await prisma.travelPlan.findUnique({
//     where: { id: travelPlanId },
//   });

//   if (!plan) {
//     throw new AppError(httpStatus.NOT_FOUND, "Travel plan not found");
//   }

//   // 2️⃣ prevent duplicate request
//   const existingRequest = await prisma.travelRequest.findUnique({
//     where: {
//       touristId_travelPlanId: {
//         touristId,
//         travelPlanId,
//       },
//     },
//   });

//   if (existingRequest) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "You have already sent a request for this travel plan"
//     );
//   }

//   // 3️⃣ create request
//   return prisma.travelRequest.create({
//     data: {
//       requesterId: touristId,
//       travelPlanId,
//     },
//   });
// };

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
