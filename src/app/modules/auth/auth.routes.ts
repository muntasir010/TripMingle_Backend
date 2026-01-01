import express from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/login", AuthController.loginUser);

router.patch("/switch-role", auth(), AuthController.switchAccountRole);

export const AuthRoutes = router;
