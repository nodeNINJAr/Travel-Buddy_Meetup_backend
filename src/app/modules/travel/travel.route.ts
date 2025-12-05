import { Router } from "express";
import { TravelController } from "./travel.controller.js";
import { checkVerifiedUser } from "../../middlewares/checkVerifiedUser.js";
import { createTravelPlanZodSchema, updateTravelPlanZodSchema} from "./travel.validation.js";
import { validationRequest } from "../../middlewares/validationReq.js";

const router = Router();

// Create Travel Plan
router.post("/create", validationRequest(createTravelPlanZodSchema),checkVerifiedUser(),TravelController.createTravelPlan);

// Get All Travel Plans
router.get("/",checkVerifiedUser(),TravelController.getAllTravelPlans);

// Get Single Travel Plan
router.get("/:id",TravelController.getTravelPlanById);

// Update Travel Plan
router.patch("/:id",checkVerifiedUser(),validationRequest(updateTravelPlanZodSchema),TravelController.updateTravelPlan);

// Delete Travel Plan
router.delete("/:id",checkVerifiedUser(),TravelController.deleteTravelPlan);
// 
router.patch("/join/:id",checkVerifiedUser(),TravelController.joinTravelPlan);

// get joined users
router.get("/joined-users/:id",checkVerifiedUser(),TravelController.getJoinedUsers);
router.get("/joined-users/admin1", checkVerifiedUser(), TravelController.getJoinedUsersAdmin);


export const TravelRoutes = router;
