import { Router } from "express";
import auth from "../../middleware/auth";
import { TravelRequestController } from "./travelRequest.controller";

const router = Router();

router.get(
  "/my-requests",
  auth("TOURIST"),
  TravelRequestController.getMyRequests
);
router.get(
  "/host",
  auth("HOST"),
  TravelRequestController.getHostRequests
);

router.patch(
  "/:id/approve",
  auth("HOST"),
  TravelRequestController.approveRequest
);

router.patch(
  "/:id/reject",
  auth("HOST"),
  TravelRequestController.rejectRequest
);
router.post(
  "/send",
  auth("TOURIST", "HOST"),
  TravelRequestController.sendRequest
);

export const travelRequestRoutes = router;
