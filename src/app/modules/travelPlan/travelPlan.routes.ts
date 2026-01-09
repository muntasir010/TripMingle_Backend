import { Router } from "express";
import auth from "../../middleware/auth";
import { TravelPlanController } from "./travelPlan.controller";
import checkActiveRole from "../../middleware/checkActiveRole";
import { fileUploader } from "../../helper/fileUploader";

const router = Router();

router.get("/", TravelPlanController.getPublicPlans);
router.get("/approved", auth("ADMIN"), TravelPlanController.getPendingPlans);

router.get("/:id", TravelPlanController.getSingleTravelPlan);

router.get("/my-plans", auth("HOST"), TravelPlanController.getMyTravelPlans);


router.get("/search", TravelPlanController.searchTravelPlans);

router.post("/", auth("HOST"), checkActiveRole("HOST"), fileUploader.upload.single("file"), TravelPlanController.createTravelPlan);

router.patch(
  "/:id/publish",
  auth("ADMIN"),
  TravelPlanController.publishTravelPlan
);

router.patch("/:id/publish", auth("HOST"), TravelPlanController.togglePublish);

router.patch("/:id", auth("HOST"), TravelPlanController.updateTravelPlan);

router.delete("/:id", auth("HOST"), TravelPlanController.deleteTravelPlan);

export const travelPlansRoutes = router;
