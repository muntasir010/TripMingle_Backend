import prisma from "../../../shared/prisma";
import AppError from "../../../shared/AppError";
import httpStatus from "http-status";

type QueryParams = {
  page?: string;
  limit?: string;
  search?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

const getAllHostApplications = async (query: QueryParams) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const search = query.search;
  const status = query.status;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  /* 🔍 SEARCH + FILTER */
  const whereConditions: any = {};

  if (status) {
    whereConditions.status = status;
  }

  if (search) {
    whereConditions.OR = [
      {
        user: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        user: {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  /* 📦 QUERY */
  const data = await prisma.hostApplication.findMany({
    where: whereConditions,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.hostApplication.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data,
  };
};

const apply = async (userId: number) => {
  const alreadyApplied = await prisma.hostApplication.findFirst({
    where: { userId },
  });

  if (alreadyApplied) {
    throw new AppError(httpStatus.BAD_REQUEST, "Already applied for host");
  }

  return prisma.hostApplication.create({
    data: {
      userId,
      status: "PENDING",
    },
  });
};

export const HostApplicationService = {
  apply,
  getAllHostApplications,
};
