import { Router } from "express";
import { TravelController } from "./travel.controller.js";
import { checkVerifiedUser } from "../../middlewares/checkVerifiedUser.js";
import { createTravelPlanZodSchema, updateTravelPlanZodSchema} from "./travel.validation.js";
import { validationRequest } from "../../middlewares/validationReq.js";
import { Role } from "../../../generated/prisma/enums.js";

const router = Router();

// Create Travel Plan
router.post("/create", validationRequest(createTravelPlanZodSchema),checkVerifiedUser(),TravelController.createTravelPlan);

// Get All Travel Plans
router.get("/",TravelController.getAllTravelPlans);
// 
router.get("/mine",checkVerifiedUser(),TravelController.getAllTravelPlansMine);
// Get All Travel Plans
router.get("/admin",checkVerifiedUser(Role.ADMIN),TravelController.getAllTravelPlansAdmin);

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
// 
router.get("/admin/joined-users", checkVerifiedUser(), TravelController.getJoinedUsersAdmin);
// 
router.patch("/change-status/:id",checkVerifiedUser(),TravelController.changeStatus);

export const TravelRoutes = router;
