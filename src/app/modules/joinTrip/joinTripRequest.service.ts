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

const sendRequest = async (userId: number, travelPlanId: number) => {
  const plan = await prisma.travelPlan.findUnique({
    where: { id: travelPlanId },
    include: {
      trips: true,
    },
  });

  if (!plan) throw new AppError(404, "Travel plan not found");

  // ❌ Date validation
  const now = new Date();
  if (now > plan.startDate) {
    throw new AppError(400, "Trip already started");
  }

  // ❌ Capacity check
  if (plan.trips.length >= plan.capacity) {
    throw new AppError(400, "Trip is full");
  }

  // ❌ Already joined?
  const already = await prisma.trip.findFirst({
    where: {
      travelPlanId,
      touristId: userId,
    },
  });

  if (already) {
    throw new AppError(400, "Already joined this trip");
  }

  // 💳 Create Payment (mock)
  const payment = await prisma.payment.create({
    data: {
      userId,
      amount: plan.budget,
      status: "PAID",
      transactionId: `TXN-${Date.now()}-${userId}`,
    },
  });

  //  Create Trip
  const trip = await prisma.trip.create({
    data: {
      travelPlanId,
      touristId: userId,
      hostId: plan.hostId,
      status: "UPCOMING",
    },
  });

  // 🧾 Attach receipt
  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      tripId: trip.id,
      receiptUrl: `/receipts/trip-${trip.id}.pdf`,
    },
  });

  return { trip, payment };
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

export const JoinTripRequest = {
  getMyRequests,
  sendRequest,
  getRequestsForHost,
  updateRequestStatus,
};
