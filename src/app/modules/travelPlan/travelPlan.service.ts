import prisma from "../../../shared/prisma";
import AppError from "../../../shared/AppError";
import httpStatus from "http-status";
import { paginationHelper } from "../../helper/paginationHelper";
import { CreateTravelPlanPayload, SearchQuery } from "./travelPlan.types";
import { getTripStatus } from "../../../utils/tripStatus";

const getPendingTravelPlans = async () => {
  const data = await prisma.travelPlan.findMany({
    where: {
      isPublished: false,
    },
  });

  return data;
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

  // ✅ Only not completed trips
  andConditions.push({
    endDate: { gte: new Date() },
  });

  const whereCondition = {
    AND: [
      ...(andConditions.length ? andConditions : []),
      { isPublished: true },
    ],
  };

  const plans = await prisma.travelPlan.findMany({
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

  const total = await prisma.travelPlan.count({
    where: whereCondition,
  });

  //  DERIVED DATA (NO DB FIELD)
  const data = plans.map((plan) => ({
    ...plan,
    tripStatus: getTripStatus(plan.startDate, plan.endDate),
    remainingSeats: plan.totalCapacity - plan.joinedCount,
  }));

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
      title: payload.title,
      destination: payload.destination,
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate),
      budget: Number(payload.budget),
      capacity: Number(payload.capacity),
      totalCapacity: Number(payload.capacity),
      joinedCount: 0,
      travelType: payload.travelType,
      description: payload.description,
      photoURL: payload.photoURL || "",
      hostId: host.id,
      isPublished: false,
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

  // block edit if published
  if (travelPlan.isPublished) {
    throw new AppError(400, "Published travel plan cannot be updated");
  }

  // ownership check
  if (travelPlan.hostId !== hostUserId) {
    throw new AppError(403, "Not your travel plan");
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
  // stop delete if published
  if (travelPlan.isPublished) {
    throw new AppError(400, "Published travel plan cannot be deleted");
  }

  // ownership check
  if (travelPlan.hostId !== hostUserId) {
    throw new AppError(403, "Not your travel plan");
  }

  if (travelPlan.host.userId !== hostUserId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Yo0u are not allowed to delete this travel plan"
    );
  }

  await prisma.travelPlan.delete({
    where: { id },
  });

  return null;
};

const searchTravelPlans = async (query: SearchQuery) => {
  const {
    destination,
    startDate,
    endDate,
    interests,
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const andConditions: any[] = [{ isPublished: true }];

  // 🔍 Destination search
  if (destination) {
    andConditions.push({
      destination: {
        contains: destination,
        mode: "insensitive",
      },
    });
  }

  // 📅 Date range filter
  if (startDate && endDate) {
    andConditions.push({
      startDate: { gte: new Date(startDate) },
      endDate: { lte: new Date(endDate) },
    });
  }

  // 🎯 Interests match (ANY match)
  if (interests) {
    const interestArray = interests.split(",");
    andConditions.push({
      interests: {
        hasSome: interestArray,
      },
    });
  }

  const whereCondition = {
    AND: andConditions,
  };

  const data = await prisma.travelPlan.findMany({
    where: whereCondition,
    skip,
    take: Number(limit),
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.travelPlan.count({
    where: whereCondition,
  });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
    data,
  };
};

const togglePublish = async (userId: number, planId: number) => {
  const plan = await prisma.travelPlan.findUnique({
    where: { id: planId },
  });

  if (!plan || plan.hostId !== userId) {
    throw new AppError(403, "Unauthorized");
  }

  return prisma.travelPlan.update({
    where: { id: planId },
    data: { isPublished: !plan.isPublished },
  });
};

export const travelPlanService = {
  getPendingTravelPlans,
  createTravelPlan,
  publishTravelPlan,
  togglePublish,
  getPublicTravelPlans,
  getSingleTravelPlan,
  getMyTravelPlans,
  updateTravelPlan,
  deleteTravelPlan,
  searchTravelPlans,
};
