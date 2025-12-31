import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { travelPlanService } from "./travelPlan.service";
import pick from "../../helper/pick";
import { travelPlanFilterableFields, travelPlanPaginationFields } from "./travelPlan.constants";

const getPublicPlans = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, travelPlanFilterableFields);
  const paginationOptions = pick(req.query, travelPlanPaginationFields);

  const result = await travelPlanService.getPublicTravelPlans(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Public travel plans fetched successfully",
    meta: result.meta,
    data: result.data,
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

const getMyTravelPlans = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const hostUserId = req.user.userId;

    const paginationOptions = pick(req.query, travelPlanPaginationFields);

    const result = await travelPlanService.getMyTravelPlans(
      hostUserId,
      paginationOptions
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "My travel plans retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const updateTravelPlan = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const id = Number(req.params.id);
    const hostUserId = req.user.userId;
    const payload = req.body;

    const result = await travelPlanService.updateTravelPlan(
      id,
      hostUserId,
      payload
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Travel plan updated successfully",
      data: result,
    });
  }
);

const deleteTravelPlan = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const id = Number(req.params.id);
  const hostUserId = req.user.userId;

  await travelPlanService.deleteTravelPlan(id, hostUserId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Travel plan deleted successfully",
    data: null,
  });
});


export const TravelPlanController = {
  getPublicPlans,
  getSingleTravelPlan,
  getMyTravelPlans,
  createTravelPlan,
  updateTravelPlan,
  deleteTravelPlan
};
