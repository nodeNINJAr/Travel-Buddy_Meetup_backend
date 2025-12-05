import { z } from "zod";

export const createTravelPlanZodSchema = z.object({
    destination: z.string(),
    country: z.string(),
    startDate: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', {
        message: "Invalid start date format",
    }),
    endDate: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', {
        message: "Invalid end date format",
    }),
    budgetMin: z.number().int().nonnegative().optional(),
    budgetMax: z.number().int().nonnegative().optional(),
    travelType: z.string(),
    description: z.string().optional(),
    interests: z.array(z.string()).optional(),
});

export const updateTravelPlanZodSchema = z.object({
    destination: z.string().optional(),
    country: z.string().optional(),
    startDate: z.string().optional().refine((date) => !date || new Date(date).toString() !== 'Invalid Date', {
        message: "Invalid start date format",
    }),
    endDate: z.string().optional().refine((date) => !date || new Date(date).toString() !== 'Invalid Date', {
        message: "Invalid end date format",
    }),
    budgetMin: z.number().int().nonnegative().optional(),
    budgetMax: z.number().int().nonnegative().optional(),
    travelType: z.string().optional(),
    description: z.string().optional(),
    interests: z.array(z.string()).optional()
});

// export const TravelValidation = {
//   createTravelPlanZodSchema,
//   updateTravelPlanZodSchema,
// };
