import { get } from "http";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { UserService } from "./user.service";
import pick from "../../helper/pick";

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

  const options = pick(req.query, ["page", "limit", "searchTerm", "sortBy", "sortOrder", "status", "role"]);
  const {page, limit, searchTerm, sortBy, sortOrder, status, role} = req.query
  const result = await UserService.getAllFromDB({page: Number(page), limit: Number(limit), searchTerm, sortBy, sortOrder, status, role} );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

export const UserController = {
  createTourist,
  getAllFromDB,
};