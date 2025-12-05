import { Router } from "express";
import { UserControllers } from "./user.controller.js";
import { validationRequest } from "../../middlewares/validationReq.js";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation.js";
import { checkVerifiedUser } from "../../middlewares/checkVerifiedUser.js";
import { Role } from "../../../generated/prisma/enums.js";


const router = Router();

router.post("/register", validationRequest(createUserZodSchema), UserControllers.createUser);
router.patch("/:id",validationRequest(updateUserZodSchema),checkVerifiedUser(...Object.values(Role)), UserControllers.updateUser);
router.get("/",checkVerifiedUser(Role.ADMIN), UserControllers.getAllUsers);
router.get("/:id",checkVerifiedUser(), UserControllers.getUserById);
router.delete("/:id",checkVerifiedUser(Role.ADMIN), UserControllers.deleteUser);
// router.post("/refresh-token", UserControllers.refreshToken);
router.post("/profile",checkVerifiedUser(Role.USER), UserControllers.createUserProfile)
router.get("/profile/me",checkVerifiedUser(Role.USER), UserControllers.getUserProfile)
export const UserRoutes =  router;
