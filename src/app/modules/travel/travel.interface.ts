import { TravelPlan } from "../../../generated/prisma/client.js";

export type ITravelPlan = TravelPlan;

export type ITravelPlanFilters = {
    searchTerm?: string;
    destination?: string;
    country?: string;
    travelType?: string;
    startDate?: string;
    endDate?: string;
    budgetMin?: number;
    budgetMax?: number;
};

export type ITravelPlanResult = {
    meta: {
        page: number;
        limit: number;
        total: number;
    };
    data: ITravelPlan[];
};
