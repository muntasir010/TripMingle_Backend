import httpStatus from 'http-status';
import config from "../../../config";
import AppError from "../../../shared/AppError";
import catchAsync from "../../../shared/catchAsync";
import prisma from "../../../shared/prisma";
import sendResponse from "../../../shared/sendResponse";
import { jwtHelper } from "../../helper/jwtHelper";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await AuthService.loginUser({
    email,
    password,
  });

  const { accessToken, refreshToken } = result;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

export const switchAccountRole = async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user.userId;
  const { role } = req.body;

  // 1️⃣ DB update (role + activeRole)
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      role,
      activeRole: role,
    },
  });

  // 2️⃣ NEW JWT PAYLOAD
  const tokenPayload = {
    userId: user.id,
    role: user.role,
    activeRole: user.activeRole,
  };

  // 3️⃣ Generate fresh access token
  const accessToken = jwtHelper.generateToken(
    tokenPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as number
  );

  // 4️⃣ Overwrite cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false, // production এ true
    sameSite: "lax",
  });

  res.status(httpStatus.OK).json({
    success: true,
    message: "Role switched successfully",
    data: user,
  });
};


const changePassword = catchAsync(async (req: any, res: Response) => {
  if (!req.user?.userId) {
    throw new AppError(401, "Unauthorized user");
  }

  const result = await AuthService.changePassword(
    req.user.userId,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  const result = await AuthService.forgotPassword(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reset link sent",
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new AppError(400, "Reset token missing");
  }

  const { newPassword } = req.body;

  const result = await AuthService.resetPassword(token, newPassword);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password reset successful",
    data: result,
  });
});

const logout = (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const AuthController = {
  loginUser,
  switchAccountRole,  
  changePassword,
  forgotPassword,
  resetPassword,
  logout,
};
