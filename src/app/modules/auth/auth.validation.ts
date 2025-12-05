import {z} from "zod";


export const recoveryPassZodSchema = z.object({
  oldPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
  
});


export const passZodSchema = z.object({
 email: z
    .string({ message: "Email must be a string" })
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
  
});