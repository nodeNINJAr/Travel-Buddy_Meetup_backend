import { Router } from "express";
import { UserControllers } from "./user.controller.js";


const router = Router();

router.post("/register", UserControllers.createUser);
router.patch("/:id", UserControllers.updateUser);
router.get("/", UserControllers.getAllUsers);
router.get("/:id", UserControllers.getUserById);
router.delete("/:id", UserControllers.deleteUser);
// router.post("/refresh-token", UserControllers.refreshToken);

export const UserRoutes =  router;
