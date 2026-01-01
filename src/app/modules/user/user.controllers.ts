import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { UserService } from "./user.service";
import pick from "../../helper/pick";
import { userFilterableFields, userOptionsFields } from "./user.constant";
import AppError from "../../../shared/AppError";

const createAdmin = catchAsync(async (req, res) => {

  if (req.body?.data) {
    req.body = JSON.parse(req.body.data);
  }
  const result = await UserService.createAdmin(req);
console.log("BODY:", req.body, result);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

const createHost = catchAsync(async (req, res) => {
  if (!req.body?.data) {
    throw new AppError(400, "Form data is required");
  }

  req.body = JSON.parse(req.body.data);

  const result = await UserService.createHost(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Host created successfully",
    data: result,
  });
});

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

const getSingleUser = catchAsync(async (req, res) => {
  const id = Number(req.params.id);

  const result = await UserService.getSingleUser(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User fetched successfully",
    data: result,
  });
});

export const UserController = {
  createAdmin,
  createHost,
  createTourist,
  getAllFromDB,
  getSingleUser,
};