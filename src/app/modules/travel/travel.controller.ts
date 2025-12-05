import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { StatusCodes } from "http-status-codes";
import { TravelServices } from "./travel.services.js";
import { VUser } from "../../../type/index.js";

// Create Travel Plan
const createTravelPlan = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Assuming req.user is attached by auth middleware
    const user = req.user as VUser;
    
    const result = await TravelServices.createTravelPlan(user.userId, req.body);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: "Travel plan created successfully",
        data: result,
    });
});

// Get All Travel Plans
const getAllTravelPlans = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit, sortBy, sortOrder, searchTerm, ...filters } = req.query;

    const result = await TravelServices.getAllTravelPlans({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        sortBy: (sortBy as string) || "createdAt",
        sortOrder: (sortOrder as "asc" | "desc") || "desc",
        searchTerm: searchTerm as string,
        filters,
    });

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Travel plans retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

// Get Single Travel Plan
const getTravelPlanById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await TravelServices.getTravelPlanById(Number(req.params.id));

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Travel plan retrieved successfully",
        data: result,
    });
});

// Update Travel Plan
const updateTravelPlan = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as VUser;
    const result = await TravelServices.updateTravelPlan(Number(req.params.id), req.body, user.userId);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Travel plan updated successfully",
        data: result,
    });
});

// Delete Travel Plan
const deleteTravelPlan = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as VUser;
    await TravelServices.deleteTravelPlan(Number(req.params.id), user.userId);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Travel plan deleted successfully",
        data: null,
    });
});

// make an join req
const joinTravelPlan = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as VUser;
    const result = await TravelServices.joinTravelPlan(Number(req.params.id), user.userId);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Travel plan joined successfully",
        data: result,
    });
}); 
// get joined users
const getJoinedUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as VUser;
    const result = await TravelServices.getJoinedUsers(Number(req.params.id), user.userId);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Travel plan joined successfully",
        data: result,
    });
}); 


// get joined users admin
const getJoinedUsersAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    console.log("fromValues",(req.query))
    const result = await TravelServices.getJoinedUsers(Number(req.query.id), Number(req.query.userId));

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Travel plan joined successfully",
        data: result,
    });
});

export const TravelController = {
    createTravelPlan,
    getAllTravelPlans,
    getTravelPlanById,
    updateTravelPlan,
    deleteTravelPlan,
    joinTravelPlan,
    getJoinedUsers,
    getJoinedUsersAdmin
};
