import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { travelPlanService } from "./travelPlan.service";
import pick from "../../helper/pick";
import {
  travelPlanFilterableFields,
  travelPlanPaginationFields,
} from "./travelPlan.constants";

const getPendingPlans = catchAsync(async (req, res) => {
  const result = await travelPlanService.getPendingTravelPlans();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Pending travel plans fetched",
    data: result,
  });
});

const getPublicPlans = catchAsync(async (req, res) => {
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

const getSingleTravelPlan = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const result = await travelPlanService.getSingleTravelPlan(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Travel plan retrieved successfully",
    data: result,
  });
});

const createTravelPlan = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {

    if (req.file) {
      req.body.photoURL = req.file.path;
    }

    const payload = {
      title: req.body.title,
      destination: req.body.destination,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      budget: req.body.budget,
      capacity: req.body.capacity,
      travelType: req.body.travelType,
      description: req.body.description,
      photoURL: req.body.photoURL,
    };

    const result = await travelPlanService.createTravelPlan(
      req.user!.userId,
      payload
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Travel plan created successfully",
      data: result,
    });
  }
);

const publishTravelPlan = catchAsync(async (req: any, res: Response) => {
  const adminUserId = req.user.userId;
  const travelPlanId = Number(req.params.id);

  const result = await travelPlanService.publishTravelPlan(
    adminUserId,
    travelPlanId
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Travel plan published successfully",
    data: result,
  });
});

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

const deleteTravelPlan = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const id = Number(req.params.id);
    const hostUserId = req.user.userId;

    await travelPlanService.deleteTravelPlan(id, hostUserId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Travel plan deleted successfully",
      data: null,
    });
  }
);

const searchTravelPlans = catchAsync(async (req: Request, res: Response) => {
  const result = await travelPlanService.searchTravelPlans(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Travel plans retrieved successfully",
    data: result,
  });
});

const togglePublish = catchAsync(async (req, res) => {
  const result = await travelPlanService.togglePublish(
    req.user.id,
    Number(req.params.id)
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Visibility updated",
    data: result,
  });
});

export const TravelPlanController = {
  getPendingPlans,
  getPublicPlans,
  getSingleTravelPlan,
  getMyTravelPlans,
  createTravelPlan,
  publishTravelPlan,
  togglePublish,
  updateTravelPlan,
  deleteTravelPlan,
  searchTravelPlans,
};
