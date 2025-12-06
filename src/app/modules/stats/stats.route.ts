import { Router } from "express";
import { checkVerifiedUser } from "../../middlewares/checkVerifiedUser.js";
import { StatsController } from "./stats.controller.js";
import { Role } from "../../../generated/prisma/enums.js";


const router = Router();

// GET /api/stats
router.get("/users", checkVerifiedUser(Role.ADMIN), StatsController.getStats);

// GET /api/stats/popular-destinations
router.get("/popular-destinations", checkVerifiedUser(Role.ADMIN), StatsController.getPopularDestinations);
// 
router.get("/reviews", checkVerifiedUser(Role.ADMIN), StatsController.getReviewStats);
// 
// Get per-user stats
router.get("/user", checkVerifiedUser(Role.USER), StatsController.getUserStats);


export const StatsRoutes = router;
