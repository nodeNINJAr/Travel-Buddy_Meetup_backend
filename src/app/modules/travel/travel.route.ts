import { Router } from "express";
import { TravelController } from "./travel.controller.js";
import { checkVerifiedUser } from "../../middlewares/checkVerifiedUser.js";
import { validationRequest } from "../../middlewares/validationReq.js";
import { TravelValidation } from "./travel.validation.js";

const router = Router();

// Create Travel Plan
router.post(
    "/",
    checkVerifiedUser(),
    validationRequest(TravelValidation.createTravelPlanZodSchema),
    TravelController.createTravelPlan
);

// Get All Travel Plans
router.get(
    "/",
    // checkVerifiedUser(), 
    TravelController.getAllTravelPlans
);

// Get Single Travel Plan
router.get(
    "/:id",
    TravelController.getTravelPlanById
);

// Update Travel Plan
router.patch(
    "/:id",
    checkVerifiedUser(),
    validationRequest(TravelValidation.updateTravelPlanZodSchema),
    TravelController.updateTravelPlan
);

// Delete Travel Plan
router.delete(
    "/:id",
    checkVerifiedUser(),
    TravelController.deleteTravelPlan
);

export const TravelRoutes = router;
