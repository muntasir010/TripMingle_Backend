import { Router } from "express";
import auth from "../../middleware/auth";
import { TravelPlanController } from "./travelPlan.controller";

const router = Router();

router.post(
  "/",
  auth("HOST"),
  TravelPlanController.createTravelPlan.createTravelPlan
);

export const travelPlansRoutes = router;
