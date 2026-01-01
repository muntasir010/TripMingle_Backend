import AppError from "../../../shared/AppError";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
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
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 60 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

const switchAccountRole = catchAsync(async (req: Request & { user?: any }, res: Response) => {
 
  const userId = req.user?.userId; 

  if (!userId) {
    throw new AppError(401, "Unauthorized user");
  }

  const { role } = req.body;

  const result = await AuthService.switchActiveRole(
    userId, 
    role
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Role switched successfully",
    data: result,
  });
});

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

export const AuthController = {
  loginUser,
  switchAccountRole,  
  changePassword,
};
