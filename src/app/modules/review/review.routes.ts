import express from "express";
import auth from "../../middleware/auth";
import { ReviewController } from "./review.controller";

const router = express.Router();

router.post("/", auth(), ReviewController.createReview);
router.patch("/:id", auth(), ReviewController.updateReview);
router.delete("/:id", auth(), ReviewController.deleteReview);
router.get("/user/:userId", ReviewController.getUserReviews);

export default router;
