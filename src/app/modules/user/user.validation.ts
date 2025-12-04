import { z } from "zod";
import { Role } from "../../../generated/prisma/enums.js";

// --------------------
export const createUserZodSchema = z.object({
  userName: z
    .string({ message: "Username must be a string" })
    .min(2, { message: "Username must be at least 2 characters long" })
    .max(50, { message: "Username cannot exceed 50 characters" }),

  email: z
    .string({ message: "Email must be a string" })
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email address" }),

  image: z.string().url().optional(),

  password :z.string().optional(),

  role: z.enum(Object.values(Role) as string[]).optional(),
});

// --------------------
// Update User Schema
// --------------------
export const updateUserZodSchema = z.object({
  userName: z
    .string({ message: "Username must be a string" })
    .min(2, { message: "Username must be at least 2 characters long" })
    .max(50, { message: "Username cannot exceed 50 characters" })
    .optional(),

  email: z
    .string({ message: "Email must be a string" })
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email address" })
    .optional(),

  emailVerified: z.boolean().optional(),

  image: z.string().url().optional(),

  role: z.enum(Object.values(Role) as string[]).optional(),

  refreshToken: z.string().optional(),
});
