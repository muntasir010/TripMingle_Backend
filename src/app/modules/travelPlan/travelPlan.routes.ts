import { Router } from "express";
import auth from "../../middleware/auth";
import { TravelPlanController } from "./travelPlan.controller";

const router = Router();


router.get("/", TravelPlanController.getPublicPlans);

router.post(
  "/send",
  auth("TOURIST", "HOST"),
  TravelPlanController.sendRequest.sendRequest
);

router.post(
  "/",
  auth("HOST"),
  TravelPlanController.createTravelPlan.createTravelPlan
);

export const travelPlansRoutes = router;
