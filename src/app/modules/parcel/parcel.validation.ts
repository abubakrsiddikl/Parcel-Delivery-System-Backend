import { z } from "zod";
import { PARCEL_STATUS } from "./parcel.interface";

// Receiver schema
const receiverZodSchema = z.object({
  user: z.string().optional(),
  email: z.email(),
  name: z.string().min(1, "Receiver name is required"),
  phone: z.string().min(6, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
});

// status log schema
const statusLogZodSchema = z.object({
  status: z.enum(Object.values(PARCEL_STATUS) as [string, ...string[]]),
  location: z.string().optional(),
  note: z.string().optional(),
  updatedBy: z.string().optional(),
  timestamp: z.date().optional(),
});

// Create Parcel schema
export const createParcelZodSchema = z.object({
  type: z.string().min(1, "Parcel type is required"),
  weight: z.number().positive("Weight must be greater than 0"),
  deliveryAddress: z.string().min(1, "Sender ID is required"),
  sender: z.string().min(1, "Delivery Address is required").optional(),
  receiver: receiverZodSchema,
  currentStatus: z
    .enum(Object.values(PARCEL_STATUS) as [string, ...string[]])
    .default(PARCEL_STATUS.REQUESTED),
  statusLogs: z.array(statusLogZodSchema).optional(),
  estimatedDelivery: z.string().optional(),
});

// update parcel zod schema
export const updateParcelZodSchema = z.object({
  type: z.string().optional(),
  weight: z.number().positive().optional(),
  fee: z.number().positive().optional(),
  estimatedDelivery: z.string().optional(), // Date as ISO string
  receiver: z
    .object({
      email: z.email().optional(),
      name: z.string().min(1, "Receiver name is required").optional(),
      phone: z.string().min(5).optional(),
      address: z.string().min(3).optional(),
    })
    .optional(),
});
