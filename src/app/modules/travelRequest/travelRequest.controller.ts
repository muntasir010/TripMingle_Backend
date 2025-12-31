import { Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { TravelRequestService } from "./travelRequest.service";
import pick from "../../helper/pick";



const getHostRequests = catchAsync(async (req: any, res: Response) => {
    const filters = pick(req.query, ["status"]);
  const paginationOptions = pick(req.query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const result = await TravelRequestService.getRequestsForHost(req.user.userId, filters, paginationOptions);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour requests fetched",
    data: result,
  });
});

const sendRequest = catchAsync(async (req, res) => {
  const result = await TravelRequestService.sendRequest(
    req.user.userId,
    req.body.travelPlanId
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour request sent successfully",
    data: result,
  });
});

const approveRequest = catchAsync(async (req: any, res: Response) => {
  const result = await TravelRequestService.updateRequestStatus(
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
  const result = await TravelRequestService.updateRequestStatus(
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

export const TravelRequestController = {
  getHostRequests,
  sendRequest,
  approveRequest,
  rejectRequest,
};