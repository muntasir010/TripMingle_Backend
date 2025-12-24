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

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

export const AuthController = {
  loginUser,
};
