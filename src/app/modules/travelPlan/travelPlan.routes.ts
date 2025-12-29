import { Router } from "express";
import auth from "../../middleware/auth";
import { TravelPlanController } from "./travelPlan.controller";

const router = Router();


router.get("/", TravelPlanController.getPublicPlans);

router.get(
  "/host",
  auth("HOST"),
  TravelPlanController.getHostRequests
);

router.patch(
  "/:id/approve",
  auth("HOST"),
  TravelPlanController.approveRequest
);

router.patch(
  "/:id/reject",
  auth("HOST"),
  TravelPlanController.rejectRequest
);
router.post(
  "/send",
  auth("TOURIST", "HOST"),
  TravelPlanController.sendRequest
);

router.post(
  "/",
  auth("HOST"),
  TravelPlanController.createTravelPlan
);

export const travelPlansRoutes = router;
