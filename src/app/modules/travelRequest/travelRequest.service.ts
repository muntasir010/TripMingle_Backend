import httpStatus from "http-status";
import AppError from "../../../shared/AppError";
import prisma from "../../../shared/prisma";
import { RequestStatus } from "@prisma/client";
import { paginationHelper } from "../../helper/paginationHelper";

const getMyRequests = async (
  requesterId: number,
  filters: any,
  options: any
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const andConditions: any[] = [];

  // filter by status
  if (filters.status) {
    andConditions.push({
      status: filters.status,
    });
  }

  const whereCondition =
    andConditions.length > 0
      ? { AND: andConditions, requesterId }
      : { requesterId };

  const data = await prisma.travelRequest.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      travelPlan: {
        include: {
          host: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const total = await prisma.travelRequest.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};

const getRequestsForHost = async (
  hostUserId: number,
  filters: any,
  options: any
) => {
  const host = await prisma.host.findUnique({
    where: { userId: hostUserId },
  });

  if (!host) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not a host");
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const andConditions: any[] = [];

  // status filtering
  if (filters.status) {
    andConditions.push({
      status: filters.status,
    });
  }

  // host constraint
  andConditions.push({
    travelPlan: {
      hostId: host.id,
    },
  });

  const whereCondition = { AND: andConditions };

  const data = await prisma.travelRequest.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      requester: {
        select: {
          id: true,
          email: true,
        },
      },
      travelPlan: {
        select: {
          id: true,
          destination: true,
          startDate: true,
          endDate: true,
        },
      },
    },
  });

  const total = await prisma.travelRequest.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};

const sendRequest = async (requesterId: number, travelPlanId: number) => {
  // travel plan exists?
  const travelPlan = await prisma.travelPlan.findUnique({
    where: { id: travelPlanId },
  });

  if (!travelPlan) {
    throw new AppError(httpStatus.NOT_FOUND, "Travel plan not found");
  }

  const host = await prisma.host.findUnique({
    where: { id: travelPlan.hostId },
  });

  if (host?.userId === requesterId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You cannot request your own travel plan"
    );
  }

  // capacity check
  const acceptedCount = await prisma.travelRequest.count({
    where: {
      travelPlanId,
      status: "ACCEPTED",
    },
  });

  if (travelPlan.capacity && acceptedCount >= travelPlan.capacity) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This travel plan is already full"
    );
  }

  // prevent duplicate request
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

  // create request
  return prisma.travelRequest.create({
    data: {
      requesterId,
      travelPlanId,
      status: RequestStatus.PENDING,
    },
  });
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

  if (request.status !== "PENDING") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Request already ${request.status}`
    );
  }

   if (status === "ACCEPTED") {
    const acceptedCount = await prisma.travelRequest.count({
      where: {
        travelPlanId: request.travelPlanId,
        status: "ACCEPTED",
      },
    });

    if (acceptedCount >= request.travelPlan.capacity) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Travel plan capacity is full"
      );
    }
  }

  const updated = await prisma.travelRequest.update({
    where: { id: requestId },
    data: { status },
  });

  return updated;
};

export const TravelRequestService = {
  getMyRequests,
  sendRequest,
  getRequestsForHost,
  updateRequestStatus,
};
