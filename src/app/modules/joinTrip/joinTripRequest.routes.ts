import { Router } from "express";
import auth from "../../middleware/auth";
import { JoinTripRequestController } from "./joinTripRequest.controller";

const router = Router();

router.get(
  "/my-requests",
  auth("TOURIST"),
  JoinTripRequestController.getMyRequests
);
router.get("/host", auth("HOST"), JoinTripRequestController.getHostRequests);

router.patch(
  "/:id/approve",
  auth("HOST"),
  JoinTripRequestController.approveRequest
);

router.patch(
  "/:id/reject",
  auth("HOST"),
  JoinTripRequestController.rejectRequest
);
router.post(
  "/send",
  auth("TOURIST", "HOST"),
  JoinTripRequestController.joinTrip
);

router.post(
  '/:planId/join',
  auth("TOURIST"),
  JoinTripRequestController.joinTrip
);

router.post(
  '/confirm',
  auth("ADMIN"),
  JoinTripRequestController.confirmJoin
);


export const JoinTripRoutes = router;
