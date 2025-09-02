import { Router } from "express";

import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { StatsControllers } from "./stats.controller";

const router = Router();

// Get Dashboard stats
router.get(
  "/",
  checkAuth(...Object.values(Role)),
  StatsControllers.getDashboardStats
);

export const StatsRoutes = router;
