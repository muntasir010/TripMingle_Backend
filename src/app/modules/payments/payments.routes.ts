import express from "express";
import auth from "../../middleware/auth";
import { PaymentController } from "./payments.controller";
import { ReceiptController } from "../receipt/receipt.controller";

const router = express.Router();

router.get(
  "/receipt/:paymentId",
  auth("TOURIST"),
  ReceiptController.downloadReceipt,
);

router.post(
  "/travel-plans/:planId/pay",
  auth(),
  PaymentController.initiatePayment,
);

router.post("/ssl-success", PaymentController.confirmPayment);

router.post("/:paymentId/confirm", auth(), PaymentController.confirmPayment);

router.post(
  "/travel-plans/:planId/cancel",
  auth("TOURIST"),
  PaymentController.cancelBooking
);

export const PaymentsRoutes = router;
