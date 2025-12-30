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

const getSingleTravelPlan = catchAsync(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const result = await travelPlanService.getSingleTravelPlan(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Travel plan retrieved successfully",
      data: result,
    });
  }
);

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
  getSingleTravelPlan,
  createTravelPlan,
};
