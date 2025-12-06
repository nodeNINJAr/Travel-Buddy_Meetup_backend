import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { StatsService } from "./stats.service.js";
import {StatusCodes} from "http-status-codes"




// 
export const StatsController = {
  getStats: catchAsync(async (req: Request, res: Response) => {
    const stats = await StatsService.getStats();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Stats fetched successfully",
      data: stats,
    });
  }),

  //
    getPopularDestinations: catchAsync(async (req: Request, res: Response) => {
    const destinations = await StatsService.getPopularDestinations();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Popular destinations fetched successfully",
      data: destinations,
    });
  }),

  // 
  getReviewStats: catchAsync(async (req: Request, res: Response) => {
    const stats = await StatsService.getReviewStats();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Review stats fetched successfully",
      data: stats,
    });
  }),





  // 
};

