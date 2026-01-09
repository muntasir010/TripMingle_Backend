import express from "express";
import auth from "../../middleware/auth";
import { AdminController } from "./admin.controller";
import { HostController } from "../host/host.controller";

const router = express.Router();

router.get("/stats", auth("ADMIN"), AdminController.getAdminStats);
router.get(
  "/host-requests",
  auth("ADMIN"),
  HostController.getAllHostApplications
);

router.get("/users", auth("ADMIN"), AdminController.getUsers);

router.patch("/users/:id/role", auth("ADMIN"), AdminController.changeUserRole);

router.patch("/:id/approve", auth("ADMIN"), HostController.approveHost);

router.patch("/:id/reject", auth("ADMIN"), HostController.rejectHostRequest);

export const AdminRoute = router;
