import { Router } from "express";
import auth from "../../middleware/auth";
import { TravelPlanController } from "./travelPlan.controller";

const router = Router();

// POST   /travel-plans        (HOST)
// GET    /travel-plans
// GET    /travel-plans/:id
// GET    /travel-plans/my     (HOST)
// PATCH  /travel-plans/:id
// DELETE /travel-plans/:id

router.get("/my-plans", auth("HOST"), TravelPlanController.getMyTravelPlans);

router.get("/", TravelPlanController.getPublicPlans);

router.get("/:id", TravelPlanController.getSingleTravelPlan);

router.post("/", auth("HOST"), TravelPlanController.createTravelPlan);

export const travelPlansRoutes = router;
