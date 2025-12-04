import { Router } from "express";
import { UserControllers } from "./user.controller.js";
import { validationRequest } from "../../middlewares/validationReq.js";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation.js";


const router = Router();

router.post("/register", validationRequest(createUserZodSchema), UserControllers.createUser);
router.patch("/:id",validationRequest(updateUserZodSchema), UserControllers.updateUser);
router.get("/", UserControllers.getAllUsers);
router.get("/:id", UserControllers.getUserById);
router.delete("/:id", UserControllers.deleteUser);
// router.post("/refresh-token", UserControllers.refreshToken);

export const UserRoutes =  router;
