import express from "express";
import auth from "../../middleware/auth";
import { ProfileController } from "./profile.controller";
import { fileUploader } from "../../helper/fileUploader";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/me", auth(), ProfileController.getMe);

router.get(
  "/:userId",
  auth("TOURIST", "HOST", "ADMIN"),
  ProfileController.getPublicProfile
);
router.post(
  "/",
  auth("TOURIST", "HOST", "ADMIN"),
  ProfileController.createProfile
);
router.patch(
  "/upload-avatar",
  auth(UserRole.ADMIN, UserRole.TOURIST, UserRole.HOST),
  fileUploader.upload.single("image"),
  ProfileController.uploadAvatar
);

export const profileRoutes = router;
