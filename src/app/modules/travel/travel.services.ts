import { Prisma } from "../../../generated/prisma/client.js";
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
              budgetMin:payload.budgetMin,
              budgetMax:payload.budgetMax,
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
      sortBy: string;
      sortOrder: "asc" | "desc";
      searchTerm?: string;
      filters?: Record<string, any>;
    }
  ): Promise<ITravelPlanResult> {
    const { page, limit, sortBy, sortOrder, searchTerm, filters } = params;
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
       // Loop through filters and add exact matches to 'where'
       Object.entries(filters).forEach(([key, value]) => {
           if (value !== undefined && value !== null) {
                // 
                if(key === 'budgetMin'){
                   where.budgetMin = { gte: Number(value) }
                } else if(key === 'budgetMax'){
                   where.budgetMax = { lte: Number(value) }
                }
               else {
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
      include: { user: {select:{userName:true, email:true, image:true}} }
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
      include: { user: {select:{userName:true, email:true, image:true}}, reviews: true },
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
async joinTravelPlan(tripId: number, userId: number) {
  // Check if travel plan exists
  const travelPlan = await prisma.travelPlan.findUnique({ where: { id: tripId } });
  if (!travelPlan) {
    throw new AppError(StatusCodes.NOT_FOUND, "Travel plan not found");
  }

  // Prevent owner from joining their own trip
  // if (travelPlan.userId === userId) {
  //   throw new AppError(StatusCodes.BAD_REQUEST, "You are already the owner of this trip");
  // }

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
      status: "PENDING",         // or "ACCEPTED" if auto-approved
    },
  });

  return friendship;
},

// 
async getJoinedUsers(tripId: number, userId: number) {
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
}


};
