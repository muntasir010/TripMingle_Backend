import config from "../../../config";
import catchAsync from "../../../shared/catchAsync";
import prisma from "../../../shared/prisma";
import { PaymentService } from "./payments.service";
import { Request, Response } from "express";

const subscribe = catchAsync(async (req, res) => {
  const url = await PaymentService.initSubscriptionPayment(
    req.user.userId,
    req.body.planId
  );

  res.json({ paymentUrl: url });
});

const successPayment = catchAsync( async (req: Request, res: Response) => {
  await PaymentService.paymentSuccess(req.query.tran_id as string);
  res.redirect(config.frontend_url + "/payment-success");
});

const failPayment = catchAsync(async (req: Request, res: Response) => {
  const tranId = req.body.tran_id || req.query.tran_id;
  await PaymentService.paymentFail(tranId);
  res.redirect(config.frontend_url + "/payment-failed");
});

const cancelPayment = async (req: Request, res: Response) => {
  const tranId = req.body.tran_id || req.query.tran_id;

  await prisma.payment.update({
    where: { transactionId: tranId },
    data: { status: "FAILED" },
  });

  res.redirect(config.frontend_url + "/payment-cancelled");
};

export const PaymentController = {
    subscribe,
    successPayment,
    failPayment,
    cancelPayment,
}