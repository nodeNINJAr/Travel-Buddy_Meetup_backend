import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { ReviewService } from "./review.service.js";
import AppError from "../../middlewares/appError.js";
import { VUser } from "../../../type/index.js";
import { ReviewStatus } from "../../../generated/prisma/enums.js";

export const ReviewController = {
  createReview: catchAsync(async (req: Request, res: Response) => {

   const toUserId = req?.query?.toUserId;
   const travelPlanId = req?.query?.travelPlanId;
   const {userId} = req?.user as VUser;

  //  
   if(!toUserId || !travelPlanId || !userId){
        throw new AppError(404,"user id and travel id not found")
   }

    const result = await ReviewService.createReview(+userId,+toUserId,+travelPlanId, req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Review created successfully",
      data: result,
    });
  }),

  getAllReviews: catchAsync(async (req: Request, res: Response) => {
    const result = await ReviewService.getAllReviews(req.query);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Reviews fetched successfully",
      data: result,
    });
  }),

  getReviewById: catchAsync(async (req: Request, res: Response) => {
    const user  = req?.user as VUser
    // 
    const result = await ReviewService.getReviewById(Number(req.params.id),+user?.userId,);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Review fetched successfully",
      data: result,
    });
  }),

  updateReview: catchAsync(async (req: Request, res: Response) => {
    const result = await ReviewService.updateReview(
      Number(req.params.id),
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Review updated successfully",
      data: result,
    });
  }),

  deleteReview: catchAsync(async (req: Request, res: Response) => {
    await ReviewService.deleteReview(Number(req.params.id));

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Review deleted successfully",
      data: null,
    });
  }),
  
  // 
  updateReviewStatus: catchAsync(async (req: Request, res: Response) => {
    const reviewId = Number(req.params.id);
    const status = (req.query.status as string).toUpperCase() as ReviewStatus;

    if (!status || !["APPROVED", "PENDING", "REJECT"].includes(status)) {
      return sendResponse(res, {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Invalid or missing status",
        data: undefined
      });
    }

    const result = await ReviewService.updateReviewStatus(reviewId, status);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Review status updated to ${status}`,
      data: result,
    });
  }),

  getReviewSummary: catchAsync(async (req: Request, res: Response) => {
    const result = await ReviewService.getReviewSummary(
      Number(req.params.userId)
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Review summary fetched",
      data: result,
    });
  }),

};
