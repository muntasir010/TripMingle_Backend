import prisma from "../../../shared/prisma";
import AppError from "../../../shared/AppError";
import httpStatus from "http-status";
import { paginationHelper } from "../../helper/paginationHelper";
import { TravelType } from "@prisma/client";

type CreateTravelPlanPayload = {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelType: TravelType;
  description?: string;
  capacity: number;
};

const getPublicTravelPlans = async (filters: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const andConditions: any[] = [];

  // 🔍 SEARCH
  if (filters.search) {
    andConditions.push({
      OR: [
        { destination: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ],
    });
  }

  // 🎛 FILTERS
  if (filters.destination) {
    andConditions.push({
      destination: { equals: filters.destination, mode: "insensitive" },
    });
  }

  if (filters.travelType) {
    andConditions.push({ travelType: filters.travelType });
  }

  if (filters.budgetMin || filters.budgetMax) {
    andConditions.push({
      budget: {
        gte: filters.budgetMin ? Number(filters.budgetMin) : undefined,
        lte: filters.budgetMax ? Number(filters.budgetMax) : undefined,
      },
    });
  }

  if (filters.startDate && filters.endDate) {
    andConditions.push({
      startDate: { gte: new Date(filters.startDate) },
      endDate: { lte: new Date(filters.endDate) },
    });
  }

  // ✅ Only upcoming tours
  andConditions.push({
    endDate: { gte: new Date() },
  });

  const whereCondition = {
    AND: [
      ...(andConditions.length ? andConditions : []),
      { isPublished: true },
    ],
  };

  const data = await prisma.travelPlan.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
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

  const total = await prisma.travelPlan.count({ where: whereCondition });

  return {
    meta: { page, limit, total },
    data,
  };
};

const getSingleTravelPlan = async (id: number) => {
  const travelPlan = await prisma.travelPlan.findUnique({
    where: {
      id,
      isPublished: true,
    },
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

const getMyTravelPlans = async (hostUserId: number, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const data = await prisma.travelPlan.findMany({
    where: {
      host: {
        userId: hostUserId,
      },
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.travelPlan.count({
    where: {
      host: {
        userId: hostUserId,
      },
    },
  });

  return {
    meta: { page, limit, total },
    data,
  };
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
      capacity: Number(payload.capacity),
      hostId: host.id,
    },
  });

  return travelPlan;
};

const publishTravelPlan = async (adminUserId: number, travelPlanId: number) => {
  // 1️⃣ check admin
  const admin = await prisma.user.findUnique({
    where: { id: adminUserId },
  });

  if (!admin || admin.role !== "ADMIN") {
    throw new AppError(403, "Only admin can publish travel plans");
  }

  // 2️⃣ check travel plan exists
  const plan = await prisma.travelPlan.findUnique({
    where: { id: travelPlanId },
  });

  if (!plan) {
    throw new AppError(404, "Travel plan not found");
  }

  // 3️⃣ already published?
  if (plan.isPublished) {
    throw new AppError(400, "Travel plan already published");
  }

  // 4️⃣ publish
  return prisma.travelPlan.update({
    where: { id: travelPlanId },
    data: {
      isPublished: true,
    },
  });
};

const updateTravelPlan = async (
  id: number,
  hostUserId: number,
  payload: any
) => {
  const travelPlan = await prisma.travelPlan.findUnique({
    where: { id },
    include: {
      host: true,
    },
  });

  if (!travelPlan) {
    throw new AppError(httpStatus.NOT_FOUND, "Travel plan not found");
  }

  if (travelPlan.host.userId !== hostUserId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to update this travel plan"
    );
  }

  const updatedPlan = await prisma.travelPlan.update({
    where: { id },
    data: {
      destination: payload.destination,
      startDate: payload.startDate ? new Date(payload.startDate) : undefined,
      endDate: payload.endDate ? new Date(payload.endDate) : undefined,
      budget: payload.budget,
      travelType: payload.travelType,
      capacity: payload.capacity ? Number(payload.capacity) : undefined,
      description: payload.description,
    },
  });

  return updatedPlan;
};

const deleteTravelPlan = async (id: number, hostUserId: number) => {
  const travelPlan = await prisma.travelPlan.findUnique({
    where: { id },
    include: {
      host: true,
    },
  });

  if (!travelPlan) {
    throw new AppError(httpStatus.NOT_FOUND, "Travel plan not found");
  }

  if (travelPlan.host.userId !== hostUserId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to delete this travel plan"
    );
  }

  await prisma.travelPlan.delete({
    where: { id },
  });

  return null;
};

export const travelPlanService = {
  createTravelPlan,
  publishTravelPlan,
  getPublicTravelPlans,
  getSingleTravelPlan,
  getMyTravelPlans,
  updateTravelPlan,
  deleteTravelPlan,
};
