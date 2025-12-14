import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { UserService } from "./user.service";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUser(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

export const UserController = {
  createUser,
};
