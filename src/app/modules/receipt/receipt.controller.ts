import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ReceiptService } from "./receipt.service";

const downloadReceipt = catchAsync(async (req, res) => {
  const paymentId = req.params.paymentId;

  const filePath = await ReceiptService.generateReceipt(paymentId);
  res.download(filePath);
});

export const ReceiptController = {
  downloadReceipt,
};
