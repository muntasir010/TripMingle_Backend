import express from "express";
import auth from "../../middleware/auth";
import { AdminController } from "./admin.controller";

const router = express.Router();
router.patch(
  "/host-applications/:id/approve",
  auth("ADMIN"),
  AdminController.approveHost
);


export const AdminRoutes = router;
