import prisma from "../../../shared/prisma";
import AppError from "../../../shared/AppError";
import httpStatus from "http-status";
import { buildPrismaQuery } from "../../../utils/queryBuilder";
import { hostApplicationSearchableFields } from "./host.constants";

// const getAllHostApplications = async (query: QueryParams) => {
//   const page = Number(query.page) || 1;
//   const limit = Number(query.limit) || 10;
//   const skip = (page - 1) * limit;

//   const search = query.search;
//   const status = query.status;

//   const sortBy = query.sortBy || "createdAt";
//   const sortOrder = query.sortOrder || "desc";

//   /* 🔍 SEARCH + FILTER */
//   const whereConditions: any = {};

//   if (status) {
//     whereConditions.status = status;
//   }

//   if (search) {
//     whereConditions.OR = [
//       {
//         user: {
//           name: {
//             contains: search,
//             mode: "insensitive",
//           },
//         },
//       },
//       {
//         user: {
//           email: {
//             contains: search,
//             mode: "insensitive",
//           },
//         },
//       },
//     ];
//   }

//   /* 📦 QUERY */
//   const data = await prisma.hostApplication.findMany({
//     where: whereConditions,
//     include: {
//       user: {
//         select: {
//           id: true,
//           name: true,
//           email: true,
//         },
//       },
//     },
//     skip,
//     take: limit,
//     orderBy: {
//       [sortBy]: sortOrder,
//     },
//   });

//   const total = await prisma.hostApplication.count({
//     where: whereConditions,
//   });

//   return {
//     meta: {
//       page,
//       limit,
//       total,
//       totalPage: Math.ceil(total / limit),
//     },
//     data,
//   };
// };

const getAllHostApplications = async (query: any) => {
  const prismaQuery = buildPrismaQuery(
    hostApplicationSearchableFields,
    query
  );

  const data = await prisma.hostApplication.findMany({
    ...prismaQuery,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const total = await prisma.hostApplication.count({
    where: prismaQuery.where,
  });

  return {
    meta: {
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      total,
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

const approveHost = async (id: number) => {
  const application = await prisma.hostApplication.findUnique({
    where: { id },
  });

  if (!application) {
    throw new AppError(httpStatus.NOT_FOUND, "Application not found");
  }

  if (application.status === "APPROVED") {
    throw new AppError(httpStatus.BAD_REQUEST, "Already approved");
  }

  return prisma.$transaction(async tx => {
    await tx.hostApplication.update({
      where: { id },
      data: { status: "APPROVED" },
    });

    await tx.host.create({
      data: {
        userId: application.userId,
      },
    });

    return { message: "Host approved successfully" };
  });
};

const rejectHostRequest = async (id: number) => {
  const application = await prisma.hostApplication.update({
    where: { id },
    data: { status: "REJECTED" },
  });

  return application;
};

export const HostService = {
  getAllHostApplications,
  apply,
  approveHost,
  rejectHostRequest
};
