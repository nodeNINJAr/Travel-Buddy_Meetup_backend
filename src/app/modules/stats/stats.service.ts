import { ReviewStatus, TravelPlanStatus } from "../../../generated/prisma/enums.js";
import { prisma } from "../../../lib/prisma.js";


export const StatsService = {
  getStats: async () => {
    // Total Users
    const totalUsers = await prisma.user.count();

    // Verified Users
    const verifiedUsers = await prisma.user.count({
      where: { emailVerified: true },
    });

    // Active Travel Plans
    const activePlans = await prisma.travelPlan.count({
      where: { status: TravelPlanStatus.ACTIVE },
    });

    // Growth Rate = comparison of users last month vs this month
    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(now.getMonth() - 1);

    const usersThisMonth = await prisma.user.count({
      where: { createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), 1) } },
    });

    const usersLastMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
          lt: new Date(now.getFullYear(), now.getMonth(), 1),
        },
      },
    });

    const growthRate =
      usersLastMonth === 0
        ? usersThisMonth * 100
        : ((usersThisMonth - usersLastMonth) / usersLastMonth) * 100;

    // Platform Rating = avg of all reviews
    const platformRatingAgg = await prisma.review.aggregate({
      _avg: { rating: true },
    });
    const platformRating = platformRatingAgg._avg.rating || 0;

    // Engagement Rate = % of users who joined at least 1 travel plan
    const usersWithPlans = await prisma.user.count({
      where: { travelPlans: { some: {} } },
    });
    const engagementRate = totalUsers === 0 ? 0 : (usersWithPlans / totalUsers) * 100;

    return {
      totalUsers,
      verifiedUsers,
      activePlans,
      growthRate: Number(growthRate.toFixed(2)) + "%",
      platformRating: Number(platformRating.toFixed(2)),
      engagementRate: Number(engagementRate.toFixed(2)) + "%",
    };
  },
  // 
   // Popular destinations
  getPopularDestinations: async () => {
    // Group by destination and count the number of travel plans
    const result = await prisma.travelPlan.groupBy({
      by: ["destination", "country"],
      _count: { destination: true },
      orderBy: { _count: { destination: "desc" } },
      take: 10,
    });

    // Format response
    return result.map((item) => ({
      destination: item.destination,
      country: item.country,
      plansCount: item._count.destination,
    }));
  },
  // 
  getReviewStats: async () => {
    // Total Reviews
    const totalReviews = await prisma.review.count();

    // Approved Reviews
    const approvedReviews = await prisma.review.count({
      where: { status:ReviewStatus.APPROVED },
    });

    // Pending Reviews
    const pendingReviews = await prisma.review.count({
      where: { status:ReviewStatus.PENDING },
    });

    // Average Rating
    const avgRatingAgg = await prisma.review.aggregate({
      _avg: { rating: true },
    });

    const avgRating = avgRatingAgg._avg.rating || 0;

    return {
      totalReviews,
      approvedReviews,
      pendingReviews,
      avgRating: Number(avgRating.toFixed(2)),
    };
  },


  // ending
};
