import { Router } from "express";
import auth from "../../middleware/auth";
import { TravelPlanController } from "./travelPlan.controller";
import checkActiveRole from "../../middleware/checkActiveRole";

const router = Router();

router.get("/my-plans", auth("HOST"), TravelPlanController.getMyTravelPlans);

router.get("/", TravelPlanController.getPublicPlans);

router.get("/:id", TravelPlanController.getSingleTravelPlan);

router.post("/", auth("HOST"), checkActiveRole("HOST"), TravelPlanController.createTravelPlan);

router.patch("/:id/publish", auth("ADMIN"), TravelPlanController.publishTravelPlan);

router.patch("/:id", auth("HOST"), TravelPlanController.updateTravelPlan);

router.delete("/:id", auth("HOST"), TravelPlanController.deleteTravelPlan);

export const travelPlansRoutes = router;
