import { Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { HostService } from "./host.service";

const getMyHostStatus = catchAsync(async (req, res) => {
  const result = await HostService.getMyHostStatus(req.user.userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Host status retrieved successfully",
    data: result,
  });
});


const getAllHostApplications = catchAsync(async (req, res) => {
  const result = await HostService.getAllHostApplications(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Host applications fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const applyHost = catchAsync(async (req: any, res: Response) => {
  const result = await HostService.apply(req.user.userId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Host application submitted",
    data: result,
  });
});

const approveHost = catchAsync(
  async (req, res) => {
    const id = Number(req.params.id);
    const result = await HostService.approveHost(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Host approved",
      data: result,
    });
  }
);

const rejectHostRequest = catchAsync(
  async (req, res) => {
    const id = Number(req.params.id);
    const result = await HostService.rejectHostRequest(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Host rejected",
      data: result,
    });
  }
);

export const HostController = {
  getMyHostStatus,
  getAllHostApplications,
  applyHost,
  approveHost,
  rejectHostRequest
};
