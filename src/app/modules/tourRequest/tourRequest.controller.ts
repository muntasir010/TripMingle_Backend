// import { Request, Response } from "express";
// import catchAsync from "../../../shared/catchAsync";
// import sendResponse from "../../../shared/sendResponse";
// import { TourRequestService } from "./tourRequest.service";

// const sendRequest = catchAsync(async (req, res) => {
//   const userId = req.user.userId;
//   const { travelPlanId } = req.body;

//   const result = await TourRequestService.sendRequest(
//     userId,
//     Number(travelPlanId)
//   );

//   sendResponse(res, {
//     statusCode: 201,
//     success: true,
//     message: "Request sent successfully",
//     data: result,
//   });
// });

import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { TourRequestService } from "./tourRequest.service";

 const sendRequest = {
  sendRequest: catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await TourRequestService.sendRequest(req.user.userId, req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Tour request sent successfully",
      data: result,
    });
  }),
};


export const TourRequestController = {
  sendRequest,
};
