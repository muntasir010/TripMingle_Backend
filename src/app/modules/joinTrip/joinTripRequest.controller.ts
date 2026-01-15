import { Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../helper/pick";
import { JoinTripRequest } from "./joinTripRequest.service";

const getMyRequests = catchAsync(async (req: any, res: Response) => {
  const filters = pick(req.query, ["status"]);
  const paginationOptions = pick(req.query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);

  const result = await JoinTripRequest.getMyRequests(
    req.user.userId,
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My travel requests fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getHostRequests = catchAsync(async (req: any, res: Response) => {
  const filters = pick(req.query, ["status"]);
  const paginationOptions = pick(req.query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const result = await JoinTripRequest.getRequestsForHost(
    req.user.userId,
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour requests fetched",
    data: result,
  });
});

const joinTrip = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { travelPlanId } = req.body;

  const result = await JoinTripRequest.sendRequest(
    userId,
    travelPlanId
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Trip join request created successfully',
    data: result,
  });
});

const approveRequest = catchAsync(async (req: any, res: Response) => {
  const result = await JoinTripRequest.updateRequestStatus(
    req.user.userId,
    Number(req.params.id),
    "CONFIRMED"
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour request approved",
    data: result,
  });
});

const rejectRequest = catchAsync(async (req: any, res: Response) => {
  const result = await JoinTripRequest.updateRequestStatus(
    req.user.userId,
    Number(req.params.id),
    "CANCELLED"
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour request rejected",
    data: result,
  });
});

const confirmJoin = catchAsync(async (req, res) => {
  const { requestId } = req.body;

  const result = await JoinTripRequest.confirmJoin(requestId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Trip booking confirmed successfully',
    data: result,
  });
});

export const JoinTripRequestController = {
  getMyRequests,
  getHostRequests,
  joinTrip,
  approveRequest,
  rejectRequest,
  confirmJoin,
};
