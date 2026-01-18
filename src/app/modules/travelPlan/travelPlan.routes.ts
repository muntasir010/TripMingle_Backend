import { Router } from "express";
import auth from "../../middleware/auth";
import { TravelPlanController } from "./travelPlan.controller";
import checkActiveRole from "../../middleware/checkActiveRole";
import { fileUploader } from "../../helper/fileUploader";

const router = Router();

// router.get("/", TravelPlanController.getPublicPlans);
// router.get("/approved", auth("ADMIN"), TravelPlanController.getPendingPlans);

// router.get("/my-plans", auth("HOST"), TravelPlanController.getMyTravelPlans);

// router.get("/search", TravelPlanController.searchTravelPlans);

// router.get("/:id", TravelPlanController.getSingleTravelPlan);

// router.post(
//   "/",
//   auth("HOST"),
//   checkActiveRole("HOST"),
//   fileUploader.upload.single("file"),
//   TravelPlanController.createTravelPlan
// );

// router.patch("/:id", auth("HOST"), TravelPlanController.updateTravelPlan);

// router.patch(
//   "/:id/publish/admin",
//   auth("ADMIN"),
//   TravelPlanController.publishTravelPlan
// );

// router.patch(
//   "/:id/publish/host",
//   // auth("HOST"),
//   TravelPlanController.togglePublish
// );


// router.delete("/:id", auth("HOST"), TravelPlanController.deleteTravelPlan);








// ✅ Public
router.get("/", TravelPlanController.getPublicPlans);
router.get("/search", TravelPlanController.searchTravelPlans);

// ✅ Host
router.get(
  "/my-plans",
  auth("HOST"),
  TravelPlanController.getMyTravelPlans
);

router.post(
  "/",
  auth("HOST"),
  checkActiveRole("HOST"),
  fileUploader.upload.single("file"),
  TravelPlanController.createTravelPlan
);

router.patch(
  "/:id",
  auth("HOST"),
  TravelPlanController.updateTravelPlan
);

router.delete(
  "/:id",
  auth("HOST"),
  TravelPlanController.deleteTravelPlan
);

router.patch(
  "/:id/publish/host",
  auth("HOST"),
  TravelPlanController.togglePublish
);

// ✅ Admin
router.get(
  "/approved",
  auth("ADMIN"),
  TravelPlanController.getPendingPlans
);

router.patch(
  "/:id/publish/admin",
  auth("ADMIN"),
  TravelPlanController.publishTravelPlan
);

router.get("/:id", TravelPlanController.getSingleTravelPlan);

export const travelPlansRoutes = router;
