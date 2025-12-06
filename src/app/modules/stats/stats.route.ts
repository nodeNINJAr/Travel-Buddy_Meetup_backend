import { Router } from "express";
import { checkVerifiedUser } from "../../middlewares/checkVerifiedUser.js";
import { StatsController } from "./stats.controller.js";


const router = Router();

// GET /api/stats
router.get("/users", checkVerifiedUser(), StatsController.getStats);

// GET /api/stats/popular-destinations
router.get("/popular-destinations", checkVerifiedUser(), StatsController.getPopularDestinations);
// 
router.get("/reviews", checkVerifiedUser(), StatsController.getReviewStats);


export const StatsRoutes = router;
