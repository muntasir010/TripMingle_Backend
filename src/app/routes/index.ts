import express from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { profileRoutes } from "../modules/profile/profile.routes";
import { travelPlansRoutes } from "../modules/travelPlan/travelPlan.routes";
import { travelRequestRoutes } from "../modules/travelRequest/travelRequest.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/profile",
    route: profileRoutes,
  },
  {
    path: "/travel-plans",
    route: travelPlansRoutes,
  },
  {
    path: "/travel-request",
    route: travelRequestRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
