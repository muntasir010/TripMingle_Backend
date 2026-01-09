import { UserRole } from "@prisma/client";
import catchAsync from "../../../shared/catchAsync";
import prisma from "../../../shared/prisma";
import sendResponse from "../../../shared/sendResponse";
import { AdminService } from "./admin.service";

const getAdminStats = catchAsync(async (req, res) => {
  const result = await AdminService.getAdminStats();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin stats fetched",
    data: result,
  });
});

const getUsers = catchAsync(async (req, res) => {
  const result = await AdminService.getAllUsers();

  res.status(200).json({
    success: true,
    data: result,
  });
});

const changeUserRole = catchAsync(async (req, res) => {
  const id = Number(req.params.id);
  const { role } = req.body;

  const result = await AdminService.changeUserRole(id, role);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User role updated successfully",
    data: result,
  });
});

export const AdminController = {
  getAdminStats,
  getUsers,
  changeUserRole,
};
