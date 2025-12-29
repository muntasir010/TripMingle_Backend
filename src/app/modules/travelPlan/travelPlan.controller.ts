import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { travelPlanService } from "./travelPlan.service";

const getPublicPlans = catchAsync(async (req: Request, res: Response) => {
  const result = await travelPlanService.getPublicTravelPlans();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Public travel plans fetched successfully",
    data: result,
  });
});

const sendRequest = catchAsync(
    async (req: Request & { user?: any }, res: Response) => {
      const result = await travelPlanService.sendRequest(
        req.user.userId,
        req.body
      );

      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Tour request sent successfully",
        data: result,
      });
    }
  );

const getHostRequests = catchAsync(async (req: any, res: Response) => {
  const result = await travelPlanService.getRequestsForHost(req.user.userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour requests fetched",
    data: result,
  });
});

const approveRequest = catchAsync(async (req: any, res: Response) => {
  const result = await travelPlanService.updateRequestStatus(
    req.user.userId,
    Number(req.params.id),
    "ACCEPTED"
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour request approved",
    data: result,
  });
});

const rejectRequest = catchAsync(async (req: any, res: Response) => {
  const result = await travelPlanService.updateRequestStatus(
    req.user.userId,
    Number(req.params.id),
    "REJECTED"
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour request rejected",
    data: result,
  });
});

const createTravelPlan = catchAsync(
    async (req: Request & { user?: any }, res: Response) => {
      const result = await travelPlanService.createTravelPlan(
        req.user.userId,
        req.body
      );

      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Travel plan created successfully",
        data: result,
      });
    }
  );

export const TravelPlanController = {
  getPublicPlans,
  createTravelPlan,
  sendRequest,
  getHostRequests,
  approveRequest,
  rejectRequest,
};
