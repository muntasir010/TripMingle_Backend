import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PaymentService } from "./payments.service";
import { Request, Response } from "express";

const initiatePayment = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const { seats } = req.body;
    const url = await PaymentService.initiatePayment(
      req.user.userId,
      Number(req.params.planId),
      Number(seats),
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Payment initiated successfully",
      data: {
        redirectURL: url,
      },
    });
  },
);

const confirmPayment = catchAsync(async (req, res) => {
  const paymentId = req.query.pid as string;

  await PaymentService.confirmPayment(paymentId);

  res.redirect(`${process.env.CLIENT_URL}/payment/success`);
});

const cancelBooking = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user.userId;
    const planId = Number(req.params.planId);

    await PaymentService.cancelBooking(userId, planId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Booking cancelled successfully",
      data: null,
    });
  },
);

export const PaymentController = {
  initiatePayment,
  confirmPayment,
  cancelBooking,
};
