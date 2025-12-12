import { FriendshipStatus, Prisma, TravelPlanStatus } from "../../../generated/prisma/client.js";
import { prisma } from "../../../lib/prisma.js";
import AppError from "../../middlewares/appError.js";
import { ITravelPlan, ITravelPlanResult } from "./travel.interface.js";
import { StatusCodes } from "http-status-codes";


export const TravelServices = {
  // Create Travel Plan
  async createTravelPlan(userId: number, payload: ITravelPlan) {
       const record = await prisma.travelPlan.findFirst({
           where:{
              userId,
              startDate:payload.startDate,
              endDate:payload.endDate,
              destination:payload.destination,
              country:payload.country,
              description:payload.description,
              travelType:payload.travelType,
              budgetMin:Number(payload.budgetMin),
              budgetMax:Number(payload.budgetMax),
           }
       });

       if(record){
           throw new AppError(StatusCodes.BAD_REQUEST, "Travel plan already exists");
       }
    // 
    const travelPlan = await prisma.travelPlan.create({
      data: {
        ...payload,
        userId,
      },
    });
    return travelPlan;
  },

    // Get All Travel Plans
    async getAllTravelPlans(
      params: {
        page: number;
        limit: number;
        searchTerm?: string;
        filters?: Record<string, any>;
      }
    ): Promise<ITravelPlanResult> {
      const { page, limit, searchTerm, filters } = params;
      const skip = (page - 1) * limit;

      const where: Prisma.TravelPlanWhereInput = {};

      // Search term
      if (searchTerm) {
        where.OR = [
          { destination: { contains: searchTerm, mode: "insensitive" } },
          { country: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
          { travelType: { contains: searchTerm, mode: "insensitive" } },
        ];
      }


      // Filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            // Handle budget range filters
            if (key === 'budgetMin') {
              where.budgetMin = { lte: Number(value) };
            } else if (key === 'budgetMax') {
              where.budgetMax = { gte: Number(value) };
            } 
            // Handle date range filters
            else if (key === 'startDate') {
              where.startDate = { gte: new Date(value as string) };
            } else if (key === 'endDate') {
              where.endDate = { lte: new Date(value as string) };
            }
            // Handle array field (interests)
            else if (key === 'interests') {
              where.interests = { has: value };
            }
            // Handle status filter
            else if (key === 'status') {
              where.status = value;
            }
            // Handle exact match filters (travelType, destination, country, etc.)
            else {
              (where as any)[key] = value;
            }
          }
        });
      }

      const total = await prisma.travelPlan.count({ where });
      const data = await prisma.travelPlan.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: { 
          user: {
            select: {
              userName: true, 
              email: true, 
              image: true
            }
          } 
        }
      });

      return {
        meta: {
          page,
          limit,
          total,
        },
        data,
      };
    },



   // Get All Travel Plans
    async getAllTravelPlansAdmin(
      params: {
        page: number;
        limit: number;
        searchTerm?: string;
        filters?: Record<string, any>;
        sortBy: string;
        sortOrder: "asc" | "desc"
      }
    ): Promise<ITravelPlanResult> {
      const { page, limit, searchTerm, filters, sortBy, sortOrder } = params;
      const skip = (page - 1) * limit;

      const where: Prisma.TravelPlanWhereInput = {};

      // Search term
      if (searchTerm) {
        where.OR = [
          { destination: { contains: searchTerm, mode: "insensitive" } },
          { country: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
          { travelType: { contains: searchTerm, mode: "insensitive" } },
        ];
      }

      console.log(filters);

      // Filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            // Handle budget range filters
            if (key === 'budgetMin') {
              where.budgetMin = { lte: Number(value) };
            } else if (key === 'budgetMax') {
              where.budgetMax = { gte: Number(value) };
            } 
            // Handle date range filters
            else if (key === 'startDate') {
              where.startDate = { gte: new Date(value as string) };
            } else if (key === 'endDate') {
              where.endDate = { lte: new Date(value as string) };
            }
            // Handle array field (interests)
            else if (key === 'interests') {
              where.interests = { has: value };
            }
            // Handle exact match filters (travelType, destination, country, etc.)
            else {
              (where as any)[key] = value;
            }
          }
        });
      }

      const total = await prisma.travelPlan.count({ where });
      const data = await prisma.travelPlan.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: { 
          user: {
            select: {
              userName: true, 
              email: true, 
              image: true
            }
          } 
        }
      });

      return {
        meta: {
          page,
          limit,
          total,
        },
        data,
      };
    },

  // Get All Travel Plans
    async getAllTravelPlansMine(
      params: {
        page: number;
        limit: number;
        sortBy: string;
        sortOrder: "asc" | "desc";
        searchTerm?: string;
        filters?: Record<string, any>;
        userId?: number;
      }
    ): Promise<ITravelPlanResult> {
      const { page, limit, sortBy, sortOrder, searchTerm, filters, userId } = params;
      const skip = (page - 1) * limit;

      const where: Prisma.TravelPlanWhereInput = {};

      // Add userId to where clause
      if (userId) {
        where.userId = userId;
      }

      // Search term
      if (searchTerm) {
        where.OR = [
          { destination: { contains: searchTerm, mode: "insensitive" } },
          { country: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
          { travelType: { contains: searchTerm, mode: "insensitive" } },
        ];
      }

      // Filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            // Handle budget range filters
            if (key === 'budgetMin') {
              // User wants plans with budgetMin >= this value
              // OR plans where their max budget can cover plans with lower minimums
              where.budgetMin = { lte: Number(value) };
            } else if (key === 'budgetMax') {
              // User wants plans with budgetMax <= this value
              // OR plans where their min budget is covered by higher budgets
              where.budgetMax = { gte: Number(value) };
            } else {
              // Exact match for other filters
              (where as any)[key] = value;
            }
          }
        });
      }

      const total = await prisma.travelPlan.count({ where });
      const data = await prisma.travelPlan.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
        include: { 
          user: {
            select: {
              userName: true, 
              email: true, 
              image: true
            }
          } 
        }
      });

      return {
        meta: {
          page,
          limit,
          total,
        },
        data,
      };
    },



  // Get Single Travel Plan
  async getTravelPlanById(id: number) {
    const travelPlan = await prisma.travelPlan.findUnique({
      where: { id },
      include: { user: true, reviews: true, friendships: true },
    });

    if (!travelPlan) {
      throw new AppError(StatusCodes.NOT_FOUND, "Travel plan not found");
    }

    return travelPlan;
  },

  // Update Travel Plan
  async updateTravelPlan(id: number, payload: Partial<ITravelPlan>, userId: number) {
    // Check existence
    const travelPlan = await prisma.travelPlan.findUnique({ where: { id } });
    if (!travelPlan) {
      throw new AppError(StatusCodes.NOT_FOUND, "Travel plan not found");
    }

    // Check ownership
    if (travelPlan.userId !== userId) {
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized to update this trip");
    }
    
    const updatedTravelPlan = await prisma.travelPlan.update({
      where: { id },
      data: payload,
    });

    return updatedTravelPlan;
  },

  // Delete Travel Plan
  async deleteTravelPlan(id: number, userId: number) {
     // Check existence
     const travelPlan = await prisma.travelPlan.findUnique({ where: { id } });
     if (!travelPlan) {
       throw new AppError(StatusCodes.NOT_FOUND, "Travel plan not found");
     }
 
     // Check ownership
     if (travelPlan.userId !== userId) {
       throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized to delete this trip");
     }

    await prisma.travelPlan.delete({
      where: { id },
    });
  },
 

  // 
async joinTravelPlan(tripId: number, userId: number, message: string) {
  // Check if travel plan exists
  const travelPlan = await prisma.travelPlan.findUnique({ where: { id: tripId } });
  if (!travelPlan) {
    throw new AppError(StatusCodes.NOT_FOUND, "Travel plan not found");
  }
  // 
    if (travelPlan.status === TravelPlanStatus.INACTIVE 
      || travelPlan.status === TravelPlanStatus.BLOCKED 
      || travelPlan.status === TravelPlanStatus.CANCELLED 
      || travelPlan.status === TravelPlanStatus.COMPLETED) {
    throw new AppError(StatusCodes.NOT_FOUND, "Travel plan not found");
  }

  // Prevent owner from joining their own trip
  if (travelPlan.userId === userId) {
    throw new AppError(StatusCodes.BAD_REQUEST, "You are already the owner of this trip");
  }

  // Check if user already joined
  const existing = await prisma.friendship.findFirst({
    where: {
      tripId,
      friendId: userId,
    },
  });
  if (existing) {
    throw new AppError(StatusCodes.BAD_REQUEST, "You have already joined this trip");
  }

  // Create a new friendship record
  const friendship = await prisma.friendship.create({
    data: {
      userId: travelPlan.userId, // owner
      friendId: userId,          // joining user
      tripId: tripId,
      status: FriendshipStatus.PENDING,         // or "ACCEPTED" if auto-approved
      message: message,
    },
  });

  return friendship;
},

// 
async getJoinedUsers(tripId: number, userId: number) {
  console.log(tripId, userId)
  // Check if travel plan exists
  const travelPlan = await prisma.travelPlan.findUnique({ where: { id: tripId } });
  if (!travelPlan) {
    throw new AppError(StatusCodes.NOT_FOUND, "Travel plan not found");
  }

  // Fetch all joined users via Friendship table
  const joinedUsers = await prisma.friendship.findMany({
    where: { tripId }, 
    include: { friend: true },          
  });

  // Map to only user data
  return joinedUsers;
},



// 
async getJoinedUsersadmin(tripId: number, userId: number) {
  console.log(tripId, userId)
  // Check if travel plan exists
  const travelPlan = await prisma.travelPlan.findUnique({ where: { id: tripId, userId } });
  if (!travelPlan) {
    throw new AppError(StatusCodes.NOT_FOUND, "Travel plan not found");
  }

  // Fetch all joined users via Friendship table
  const joinedUsers = await prisma.friendship.findMany({
    where: { tripId }, 
    include: { friend: true },          
  });

  // Map to only user data
  return joinedUsers.map(f => f.friend);
},

// 
async changeStatus(tripId: number, userId: number, status:any) {
  // Check if travel plan exists
  const travelPlan = await prisma.travelPlan.findFirst({ where: { id:tripId, userId } });
  if (!travelPlan) {
    throw new AppError(StatusCodes.NOT_FOUND, "Travel plan not found");
  }
  const friendship = await prisma.friendship.findFirst({ where: { tripId:travelPlan.id} });
  if (!friendship) {
    throw new AppError(StatusCodes.NOT_FOUND, "Friendship not found");
  }
  console.log(status)
  // 
  if(!status){
    throw new AppError(StatusCodes.BAD_REQUEST, "Status is required");
  }

  // 
  const updatedFriendship = await prisma.friendship.update({
    where: { id: friendship.id },
    data: status,
  });

  // Map to only user data
  return updatedFriendship;
},


};
