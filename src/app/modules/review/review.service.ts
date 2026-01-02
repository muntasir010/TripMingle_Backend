import httpStatus from "http-status";
import AppError from "../../../shared/AppError";
import prisma from "../../../shared/prisma";

const createReview = async (
  reviewerId: number,
  payload: {
    revieweeId: number;
    rating: number;
    comment: string;
    tripId: number;
    travelPlanId: number;
  }
) => {
  if (reviewerId === payload.revieweeId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You cannot review yourself"
    );
  }

  // Optional: prevent duplicate review
  const existing = await prisma.review.findFirst({
    where: {
      reviewerId,
      revieweeId: payload.revieweeId,
    },
  });

  if (existing) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already reviewed this user"
    );
  }

  return prisma.review.create({
    data: {
      rating: payload.rating,
      comment: payload.comment,
      reviewerId,
      revieweeId: payload.revieweeId,
      tripId: payload.tripId,
      travelPlanId: payload.travelPlanId,
    },
  });
};

const updateReview = async (
  userId: number,
  reviewId: number,
  payload: { rating?: number; comment?: string }
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review || review.reviewerId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "Unauthorized");
  }

  return prisma.review.update({
    where: { id: reviewId },
    data: payload,
  });
};

const deleteReview = async (userId: number, reviewId: number) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review || review.reviewerId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "Unauthorized");
  }

  await prisma.review.delete({ where: { id: reviewId } });

  return { message: "Review deleted successfully" };
};

const getUserReviewsAndRating = async (userId: number) => {
  const reviews = await prisma.review.findMany({
    where: { revieweeId: userId },
    include: {
      reviewer: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const avg = await prisma.review.aggregate({
    where: { revieweeId: userId },
    _avg: { rating: true },
  });

  return {
    averageRating: avg._avg.rating ?? 0,
    totalReviews: reviews.length,
    reviews,
  };
};

export const ReviewService = {
    createReview,
    updateReview,
    deleteReview,
    getUserReviewsAndRating
}