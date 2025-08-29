import { z } from "zod";
import { Role, IsActive } from "./user.interface";

//  User Create Validation
export const createUserZodSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .optional(),
  phone: z.string().optional(),
  picture: z.url({ message: "Invalid URL" }).optional(),
  address: z.string().optional(),
  isDeleted: z.boolean().optional(),
  isActive: z.enum(Object.values(IsActive)).optional(),
  role: z.enum(Object.values(Role)).optional(),
});

//  User Update Validation
export const updateUserZodSchema = z.object({
  name: z.string().optional(),
  email: z.email({ message: "Invalid email address" }).optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .optional(),
  phone: z.string().optional(),
  picture: z.url({ message: "Invalid URL" }).optional(),
  address: z.string().optional(),
  isDeleted: z.boolean().optional(),
  isActive: z.enum(Object.values(IsActive)).optional(),
  role: z.enum(Object.values(Role)).optional(),
});
