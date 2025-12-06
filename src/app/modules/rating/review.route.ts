import { Router } from "express";
import { ReviewController } from "./review.controller.js";
import { ReviewValidation } from "./review.validation.js";
import { validationRequest } from "../../middlewares/validationReq.js";
import { checkVerifiedUser } from "../../middlewares/checkVerifiedUser.js";
import { Role } from "../../../generated/prisma/enums.js";


const router = Router();

// Create Review
router.post(
  "/",
  checkVerifiedUser(Role.USER, Role.ADMIN),
  validationRequest(ReviewValidation.createReview),
  ReviewController.createReview
);

// Get all (with filters & search)
router.get("/", checkVerifiedUser(), ReviewController.getAllReviews);

// Get summary for a user
router.get("/summary/:userId", checkVerifiedUser(), ReviewController.getReviewSummary);

// Get single review
router.get("/:id", checkVerifiedUser(), ReviewController.getReviewById);

// Update
router.patch(
  "/:id",
   checkVerifiedUser(),
  validationRequest(ReviewValidation.updateReview),
  ReviewController.updateReview
);

// Delete
router.delete("/:id", checkVerifiedUser(), ReviewController.deleteReview);

export const ReviewRoutes = router;
