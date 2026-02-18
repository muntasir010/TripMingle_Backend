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

const confirmPayment = async (req: Request, res: Response) => {
  // const paymentId = req.query.paymentId as string;
   const paymentId = req.body.tran_id;
console.log("Received payment confirmation for ID:", paymentId, req.body);
  console.log("Payment ID from query:", paymentId); 

  await PaymentService.confirmPayment(paymentId);

  res.redirect(`${process.env.CLIENT_URL}/payment/success`);
};


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
