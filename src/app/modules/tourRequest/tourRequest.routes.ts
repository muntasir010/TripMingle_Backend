import { Router } from "express";
import auth from "../../middleware/auth";
import { TourRequestController } from "./tourRequest.controller";

const router = Router();

router.post(
  "/send",
  auth("TOURIST", "HOST"),
  TourRequestController.sendRequest.sendRequest
);

export const tourRequestRoutes = router;
