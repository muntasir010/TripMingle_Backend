// POST   /tour-requests           (TOURIST)
// GET    /tour-requests/host      (HOST)
// PATCH  /tour-requests/:id/approve
// PATCH  /tour-requests/:id/reject

import { Router } from "express";
import auth from "../../middleware/auth";
import { TravelRequestController } from "./travelRequest.controller";

const router = Router();

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
