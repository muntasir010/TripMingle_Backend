import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ReviewService } from "./review.service";

const createReview = catchAsync(async (req: any, res: Response) => {
  const result = await ReviewService.createReview(
    req.user.userId,
    req.body
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Review submitted successfully",
    data: result,
  });
});

const updateReview = catchAsync(async (req: any, res: Response) => {
  const result = await ReviewService.updateReview(
    req.user.userId,
    Number(req.params.id),
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review updated",
    data: result,
  });
});

const deleteReview = catchAsync(async (req: any, res: Response) => {
  const result = await ReviewService.deleteReview(
    req.user.userId,
    Number(req.params.id)
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review deleted",
    data: result,
  });
});

const getUserReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getUserReviewsAndRating(
    Number(req.params.userId)
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User reviews fetched",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  updateReview,
  deleteReview,
  getUserReviews,
};
