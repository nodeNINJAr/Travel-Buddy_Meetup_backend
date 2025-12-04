import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { StatusCodes } from "http-status-codes";
import { UserServices } from "./user.services.js";


// Create User
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserServices.createUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "User Created Successfully",
    data: user,
  });
});

// Update User
const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserServices.updateUser(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User Updated Successfully",
    data: user,
  });
});

// Get All Users with pagination, filtering, sorting
const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit, sortBy, sortOrder, searchTerm, ...filters } = req.query;

  const result = await UserServices.getAllUsers({
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
    message: "Users retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

// Get Single User by ID
const getUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserServices.getUserById(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User retrieved successfully",
    data: user,
  });
});

// Delete User
const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await UserServices.deleteUser(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User deleted successfully",
    data:null,
  });
});

// Export Controllers
export const UserControllers = {
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser,
};
