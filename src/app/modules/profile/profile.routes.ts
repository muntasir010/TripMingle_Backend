import express from "express";
import auth from "../../middleware/auth";
import { ProfileController } from "./profile.controller";

const router = express.Router();


router.get("/:userId", auth("TOURIST", "HOST", "ADMIN"), ProfileController.getPublicProfile);
router.post("/", auth("TOURIST", "HOST", "ADMIN"), ProfileController.createProfile);

export const profileRoutes = router;
