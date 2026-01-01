import express from "express";
import auth from "../../middleware/auth";
import { HostApplicationController } from "./hostApplication.controller";
const router = express.Router();

router.get(
  "/host-applications",
  auth("ADMIN"),
  HostApplicationController.getAllHostApplications
);

router.post("/apply", auth(), HostApplicationController.applyHost);

export const HostRoutes = router;
