import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { UserService } from "./user.service";

const createTourist = catchAsync(async (req, res) => {
  const result = await UserService.createTourist(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tourist created successfully",
    data: result,
  });
});

export const UserController = {
  createTourist
};