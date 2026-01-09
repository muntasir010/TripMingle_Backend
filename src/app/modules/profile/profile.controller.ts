import { Request, Response } from "express";
import AppError from "../../../shared/AppError";
import catchAsync from "../../../shared/catchAsync";
import prisma from "../../../shared/prisma";
import sendResponse from "../../../shared/sendResponse";
import { fileUploader } from "../../helper/fileUploader";
import { ProfileService } from "./profile.service";

const getMe = async (req: Request & { user?: any }, res: Response) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    include: {
      hostApplications: {
        select: {
          status: true, 
        },
      },
      host: true,
    },
  });

  res.status(200).json({
    success: true,
    data: {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      role: user?.role,
      profilePhoto: user?.profilePhoto,
      hostStatus: user?.hostApplications?.status ?? null,
      isHostApproved: !!user?.host,
    },
  });
};




const createProfile = catchAsync(async (req, res) => {
  const userId = req.user?.userId;

  const result = await ProfileService.createProfile(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Profile created successfully",
    data: result,
  });
});

const getPublicProfile = catchAsync(async (req, res) => {
  const userId = Number(req.params.userId);

  const result = await ProfileService.getPublicProfile(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Public profile fetched successfully",
    data: result,
  });
});

const uploadAvatar = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError(400, "Image is required");
  }

  const uploadResult = await fileUploader.uploadCloudinary(req.file);

  const updatedUser = await prisma.user.update({
    where: { id: req.user!.id },
    data: {
      profilePhoto: uploadResult.secure_url,
    },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Avatar updated",
    data: {
      profilePhoto: updatedUser.profilePhoto,
    },
  });
});
export const ProfileController = {
  createProfile,
  getPublicProfile,
  uploadAvatar,
  getMe
};
