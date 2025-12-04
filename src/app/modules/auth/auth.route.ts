import { Router } from "express";
import { AuthControllers } from "./auth.controller.js";
import { validationRequest } from "../../middlewares/validationReq.js";
import { passZodSchema, recoveryPassZodSchema } from "./auth.validation.js";



const router = Router();


// 
router.post("/login",validationRequest(passZodSchema), AuthControllers.credentialsLogin);
router.post("/refresh-token", AuthControllers.getNewAccessTokens);
router.post("/logout", AuthControllers.userLogOut);
router.post("/reset-password",validationRequest(recoveryPassZodSchema), AuthControllers.resetPassword);

export const AuthRoutes = router;