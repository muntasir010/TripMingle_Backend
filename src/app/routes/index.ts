import { AdminRoute } from './../modules/admin/admin.routes';
import express from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { profileRoutes } from "../modules/profile/profile.routes";
import { travelPlansRoutes } from "../modules/travelPlan/travelPlan.routes";
import { HostRoutes } from "../modules/host/host.routes";
import { PaymentsRoutes } from "../modules/payments/payments.routes";
import { JoinTripRoutes } from '../modules/joinTrip/joinTripRequest.routes';

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
    path: "/admin",
    route: AdminRoute,
  },
  {
    path: "/host",
    route: HostRoutes,
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
    route: JoinTripRoutes,
  },
  {
    path: "/payments",
    route: PaymentsRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
