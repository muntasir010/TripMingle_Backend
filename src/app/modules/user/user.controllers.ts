import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { UserService } from "./user.service";
import pick from "../../helper/pick";
import { userFilterableFields, userOptionsFields } from "./user.constant";

const createTourist = catchAsync(async (req, res) => {
  const result = await UserService.createTourist(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tourist created successfully",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {

  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, userOptionsFields);
   
  const result = await UserService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const UserController = {
  createTourist,
  getAllFromDB,
};