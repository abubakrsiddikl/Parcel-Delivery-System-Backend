"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("./user.interface");
//  User Create Validation
exports.createUserZodSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    email: zod_1.z.email({ message: "Invalid email address" }),
    password: zod_1.z
        .string()
        .min(6, { message: "Password must be at least 6 characters" })
        .optional(),
    phone: zod_1.z.string().optional(),
    picture: zod_1.z.url({ message: "Invalid URL" }).optional(),
    address: zod_1.z.string().optional(),
    isDeleted: zod_1.z.boolean().optional(),
    isActive: zod_1.z.enum(Object.values(user_interface_1.IsActive)).optional(),
    role: zod_1.z.enum([user_interface_1.Role.SENDER, user_interface_1.Role.RECEIVER], {
        message: "Role must be either sender or receiver",
    }),
});
//  User Update Validation
exports.updateUserZodSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.email({ message: "Invalid email address" }).optional(),
    password: zod_1.z
        .string()
        .min(6, { message: "Password must be at least 6 characters" })
        .optional(),
    phone: zod_1.z.string().optional(),
    picture: zod_1.z.url({ message: "Invalid URL" }).optional(),
    address: zod_1.z.string().optional(),
    isDeleted: zod_1.z.boolean().optional(),
    isActive: zod_1.z.enum(Object.values(user_interface_1.IsActive)).optional(),
    role: zod_1.z.enum(Object.values(user_interface_1.Role)).optional(),
});
