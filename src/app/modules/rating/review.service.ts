import { ReviewStatus } from "../../../generated/prisma/enums.js";
import { prisma } from "../../../lib/prisma.js";
import AppError from "../../middlewares/appError.js";
import { Ireviews } from "./review.interface.js";


export const ReviewService = {
  // Create review with duplicate prevention
  createReview: async (fromUserId:number, toUserId:number,travelPlanId:number,payload:Ireviews) => {

    // 
    const exists = await prisma.review.findFirst({
      where: {
        fromUserId:fromUserId,
        toUserId:toUserId,
        travelPlanId:travelPlanId,
      },
    });
    // 
    if (exists) throw new AppError(400, "You already reviewed this user.");

    return await prisma.review.create({
      data:{
         ...payload,
         toUserId,
         travelPlanId,
         fromUserId
      },
      include: { fromUser: true, toUser: true, travelPlan: true },
    });
  },

  // Get all with filters, search, pagination
  getAllReviews: async (query: any) => {
    const {
      page = 1,
      limit = 10,
      search = "",
      fromUserId,
      toUserId,
      travelPlanId,
      minRating,
      maxRating,
      sortBy = "createdAt",
      sortOrder = "desc",
      startDate,
      endDate,
    } = query;

    const skip = (Number(page) - 1) * Number(limit);

    return await prisma.review.findMany({
      skip,
      take: Number(limit),
      where: {
        AND: [
          search
            ? {
                OR: [
                  { comment: { contains: search, mode: "insensitive" } },
                  { fromUser: { userName: { contains: search, mode: "insensitive" } } },
                  { toUser: { userName: { contains: search, mode: "insensitive" } } },
                ],
              }
            : {},
          fromUserId ? { fromUserId: Number(fromUserId) } : {},
          toUserId ? { toUserId: Number(toUserId) } : {},
          travelPlanId ? { travelPlanId: Number(travelPlanId) } : {},
          minRating ? { rating: { gte: Number(minRating) } } : {},
          maxRating ? { rating: { lte: Number(maxRating) } } : {},
          startDate && endDate
            ? { createdAt: { gte: new Date(startDate), lte: new Date(endDate) } }
            : {},
        ],
      },
      include: { fromUser: true, toUser: true, travelPlan: true },
      orderBy: { [sortBy]: sortOrder },
    });
  },

  getReviewById: async (id: number, userId:number) => {
    return await prisma.review.findFirst({
      where: {
        OR:[
          {id},
          {fromUserId:userId},
          {toUserId:userId}
        ]
      },
      include: { fromUser: true, toUser: true, travelPlan: true },
    });
  },

  updateReview: async (id: number, payload: Ireviews) => {
    return await prisma.review.update({
      where: { id },
      data: payload,
      include: { fromUser: true, toUser: true, travelPlan: true },
    });
  },

  deleteReview: async (id: number) => {
    return await prisma.review.delete({
      where: { id },
    });
  },
  // update review status
    updateReviewStatus: async (id: number, status:ReviewStatus) => {
      const review = await prisma.review.findUnique({ where: { id } });
      if (!review) throw new AppError(404, "Review not found");

      return await prisma.review.update({
        where: { id },
        data: { status },
        include: { fromUser: true, toUser: true, travelPlan: true },
      });
    },
    
  // Summary (avg rating + total)
  getReviewSummary: async (userId: number) => {
    const [agg, list] = await prisma.$transaction([
      prisma.review.aggregate({
        where: { toUserId: userId },
        _avg: { rating: true },
        _count: { rating: true },
      }),

      prisma.review.findMany({
        where: { toUserId: userId },
        include: { fromUser: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    return {
      averageRating: agg._avg.rating || 0,
      totalReviews: agg._count.rating,
      recentReviews: list,
    };
  },
};
