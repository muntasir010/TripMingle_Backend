import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ProfileService } from "./profile.service";

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



export const ProfileController = {
  createProfile,
};
