import { Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { HostApplicationService } from "./hostApplication.service";

const applyHost = catchAsync(async (req: any, res: Response) => {
  const result = await HostApplicationService.apply(req.user.userId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Host application submitted",
    data: result,
  });
});

export const HostApplicationController = {
  applyHost,
};
