import httpStatus from "http-status";
import { Request } from "express";
import bcrypt from "bcryptjs";
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../helper/fileUploader";
import AppError from "../../../shared/AppError";
import { paginationHelper } from "../../helper/paginationHelper";
import { Prisma } from "@prisma/client";
import { userSearchableFields } from "./user.constant";

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

const createHost = async (req: any) => {
  const { host, password } = req.body;

  if (!host || !password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Host data & password are required"
    );
  }

  // 1. user already exists?
  const isExist = await prisma.user.findUnique({
    where: { email: host.email },
  });

  if (isExist) {
    throw new AppError(httpStatus.CONFLICT, "User already exists");
  }

  // 2. image upload
  if (req.file) {
    const uploadResult = await fileUploader.uploadCloudinary(req.file);
    host.profilePhoto = uploadResult?.secure_url;
  }

  // 3. password hash
  const hashedPassword = await bcrypt.hash(password, 12);

  // 4. transaction
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: host.name,
        email: host.email,
        password: hashedPassword,
        role: "HOST",
        profilePhoto: host.profilePhoto,
      },
    });

    const hostData = await tx.host.create({
      data: {
        userId: user.id,
        phone: host.phone ?? null,
        address: host.address ?? null,
      },
    });

    return { user, host: hostData };
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

const getSingleUser = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
};

const updateUser = async (id: number, payload: any) => {
  await prisma.user.findUniqueOrThrow({ where: { id } });

  return prisma.user.update({
    where: { id },
    data: payload,
  });
};

const deleteUser = async (id: number) => {
  return prisma.user.update({
    where: { id },
    data: { isDeleted: true },
  });
};


const getMyProfile = async (reqUser: any) => {
  const { userId, email } = reqUser;
  const user = await prisma.user.findFirst({ 
    where: {
      OR: [{ id: userId }, { email: email }]
    }
  })

  
  if (!user) {
    throw new Error("User not found!");
  }

  return user;
};



export const UserService = {
  createTourist,
  createHost,
  createAdmin,
  getAllFromDB,
  getSingleUser,
  updateUser,
  deleteUser,
  getMyProfile
};
