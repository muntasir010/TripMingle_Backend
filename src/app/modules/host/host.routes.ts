import express from "express";
import auth from "../../middleware/auth";
import { HostController } from "./host.controller";

const router = express.Router();

router.get("/me", auth(), HostController.getMyHostStatus);

router.get(
  "/host-requests",
  auth("ADMIN"),
  HostController.getAllHostApplications
);

router.post("/apply", auth(), HostController.applyHost);

router.patch("/:id/approve", auth("ADMIN"), HostController.approveHost);

router.patch("/:id/reject", auth("ADMIN"), HostController.rejectHostRequest);

export const HostRoutes = router;
