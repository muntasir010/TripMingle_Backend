import express from "express";
import auth from "../../middleware/auth";
import { PaymentController } from "./payments.controller";

const router = express.Router();

router.post("/subscribe", auth(), PaymentController.subscribe);
router.post("/success", PaymentController.successPayment);
router.post("/fail", PaymentController.failPayment);
router.post("/cancel", PaymentController.cancelPayment);

export const PaymentsRoutes = router;
