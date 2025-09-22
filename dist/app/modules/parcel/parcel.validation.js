"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateParcelZodSchema = exports.createParcelZodSchema = void 0;
const zod_1 = require("zod");
const parcel_interface_1 = require("./parcel.interface");
// Receiver schema
const receiverZodSchema = zod_1.z.object({
    user: zod_1.z.string().optional(),
    email: zod_1.z.email(),
    name: zod_1.z.string().min(1, "Receiver name is required"),
    phone: zod_1.z.string().min(6, "Phone number is required"),
    address: zod_1.z.string().min(1, "Address is required"),
});
// status log schema
const statusLogZodSchema = zod_1.z.object({
    status: zod_1.z.enum(Object.values(parcel_interface_1.PARCEL_STATUS)),
    location: zod_1.z.string().optional(),
    note: zod_1.z.string().optional(),
    updatedBy: zod_1.z.string().optional(),
    timestamp: zod_1.z.date().optional(),
});
// Create Parcel schema
exports.createParcelZodSchema = zod_1.z.object({
    type: zod_1.z.string().min(1, "Parcel type is required"),
    weight: zod_1.z.number().positive("Weight must be greater than 0"),
    deliveryAddress: zod_1.z.string().min(1, "Sender ID is required"),
    sender: zod_1.z.string().min(1, "Delivery Address is required").optional(),
    receiver: receiverZodSchema,
    currentStatus: zod_1.z
        .enum(Object.values(parcel_interface_1.PARCEL_STATUS))
        .default(parcel_interface_1.PARCEL_STATUS.REQUESTED),
    statusLogs: zod_1.z.array(statusLogZodSchema).optional(),
    estimatedDelivery: zod_1.z.string().optional(),
});
// update parcel zod schema
exports.updateParcelZodSchema = zod_1.z.object({
    type: zod_1.z.string().optional(),
    weight: zod_1.z.number().positive().optional(),
    fee: zod_1.z.number().positive().optional(),
    estimatedDelivery: zod_1.z.string().optional(), // Date as ISO string
    receiver: zod_1.z
        .object({
        email: zod_1.z.email().optional(),
        name: zod_1.z.string().min(1, "Receiver name is required").optional(),
        phone: zod_1.z.string().min(5).optional(),
        address: zod_1.z.string().min(3).optional(),
    })
        .optional(),
});
