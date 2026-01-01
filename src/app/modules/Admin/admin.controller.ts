import { Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AdminService } from "./admin.service";

const approveHost = catchAsync(async (req: any, res: Response) => {
  const applicationId = Number(req.params.id);

  const result = await AdminService.approveHost(applicationId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Host approved successfully",
    data: result,
  });
});

export const AdminController = {
  approveHost,
};
