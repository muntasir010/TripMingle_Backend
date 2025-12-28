import httpStatus from "http-status";
import { Request } from "express";
import bcrypt from "bcryptjs";
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../helper/fileUploader";
import AppError from "../../../shared/AppError";
import { paginationHelper } from "../../helper/paginationHelper";
import { Prisma } from "@prisma/client";
import { userSearchableFields } from "./user.constant";

// const createAdmin = async (req: Request) => {
//   const { admin } = req.body;
//   const isExist = await prisma.user.findUnique({
//     where: { email: admin.email },
//   });

//   if (isExist) {
//     throw new AppError(httpStatus.CONFLICT, "User already exists");
//   }

//   if (req.file) {
//     const uploadResult = await fileUploader.uploadCloudinary(req.file);
//     req.body.admin.profilePhoto = uploadResult?.secure_url;
//   }

//   const hashedPassword = await bcrypt.hash(req.body.password, 12);

//   const result = await prisma.$transaction(async (tx) => {
//     const user = await tx.user.create({
//       data: {
//         // name: req.name,
//         // email: payload.email,
//         // password: hashedPassword,
//         // role: "ADMIN",
//         name: req.body.admin.name,
//         email: req.body.admin.email,
//         password: hashedPassword,
//         role: "ADMIN",
//         profilePhoto: req.body.admin.profilePhoto,
//       },
//     });

//     const admin = await tx.admin.create({
//       data: {
//         userId: user.id,
//         phone: req.body.tourist?.phone ?? null,
//         country: req.body.tourist?.country ?? null,
//         bio: req.body.tourist?.bio ?? null,
//       },
//     });

//     return { user, admin };
//   });

//   return result;
// };

// const createAdmin = async (req: Request) => {
//   const { admin } = req.body;

//   const isUserExists = await prisma.user.findUnique({
//     where: { email: admin.email },
//   });

//   if (isUserExists) {
//     throw new AppError(400, "Email already exists");
//   }

//   if (req.file) {
//     const uploadResult = await fileUploader.uploadCloudinary(req.file);
//     req.body.tourist.profilePhoto = uploadResult?.secure_url;
//   }

//   const hashedPassword = await bcrypt.hash(req.body.password, 12);

//   const result = await prisma.$transaction(async (tnx) => {
//     // 1. create user
//     const user = await tnx.user.create({
//       data: {
//         name: req.body.admin.name,
//         email: req.body.admin.email,
//         password: hashedPassword,
//         role: "ADMIN",
//         profilePhoto: req.body.admin.profilePhoto,
//       },
//     });

//     // 2. create tourist (ONLY schema fields)
//     const admin = await tnx.admin.create({
//       data: {
//         userId: user.id,
//         phone: req.body.admin?.phone ?? null,
//       },
//     });

//     return { user, admin };
//   });

//   return result;
// };

// const createAdmin = async (req: Request) => {
//   if (!req.body?.admin) {
//   throw new AppError(400, "Admin data is required");
// }
//   const { admin } = req.body;

//   const isExist = await prisma.user.findUnique({
//     where: { email: admin.email },
//   });

//   if (isExist) {
//     throw new AppError(httpStatus.CONFLICT, "User already exists");
//   }

//   if (req.file) {
//     const uploadResult = await fileUploader.uploadCloudinary(req.file);
//     admin.profilePhoto = uploadResult?.secure_url;
//   }

//   const hashedPassword = await bcrypt.hash(admin.password, 12);

//   const result = await prisma.$transaction(async (tx) => {
//     const user = await tx.user.create({
//       data: {
//         name: admin.name,
//         email: admin.email,
//         password: hashedPassword,
//         role: "ADMIN",
//         profilePhoto: admin.profilePhoto,
//       },
//     });

//     const adminData = await tx.admin.create({
//       data: {
//         userId: user.id,
//       },
//     });

//     return { user, admin: adminData };
//   });

//   return result;
// };


const createAdmin = async (req: Request) => {
  const { admin, password } = req.body;

  if (!admin || !password) {
    throw new AppError(400, "Admin data & password are required");
  }

  const isExist = await prisma.user.findUnique({
    where: { email: admin.email },
  });

  if (isExist) {
    throw new AppError(httpStatus.CONFLICT, "User already exists");
  }

  if (req.file) {
    const uploadResult = await fileUploader.uploadCloudinary(req.file);
    admin.profilePhoto = uploadResult?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: admin.name,
        email: admin.email,
        password: hashedPassword,
        role: "ADMIN",
        profilePhoto: admin.profilePhoto,
      },
    });

    const adminData = await tx.admin.create({
      data: {
        userId: user.id,
      },
    });

    return { user, admin: adminData };
  });

  return result;
};



const createTourist = async (req: Request) => {
  const { tourist } = req.body;

  const isUserExists = await prisma.user.findUnique({
    where: { email: tourist.email },
  });

  if (isUserExists) {
    throw new AppError(400, "Email already exists");
  }

  if (req.file) {
    const uploadResult = await fileUploader.uploadCloudinary(req.file);
    req.body.tourist.profilePhoto = uploadResult?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const result = await prisma.$transaction(async (tnx) => {
    // 1. create user
    const user = await tnx.user.create({
      data: {
        name: req.body.tourist.name,
        email: req.body.tourist.email,
        password: hashedPassword,
        role: "TOURIST",
        profilePhoto: req.body.tourist.profilePhoto,
      },
    });

    // 2. create tourist (ONLY schema fields)
    const tourist = await tnx.tourist.create({
      data: {
        userId: user.id,
        phone: req.body.tourist?.phone ?? null,
        country: req.body.tourist?.country ?? null,
        bio: req.body.tourist?.bio ?? null,
      },
    });

    return { user, tourist };
  });

  return result;
};

const getAllFromDB = async (params: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  console.log(andConditions);

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const result = await prisma.user.findMany({
    skip,
    take: limit,

    where: {
      AND: andConditions,
    },

    orderBy: { [sortBy]: sortOrder },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: {
      result,
    },
  };
};

export const UserService = {
  createTourist,
  createAdmin,
  getAllFromDB,
};
