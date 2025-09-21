import { Types } from "mongoose";

export enum PARCEL_STATUS {
  REQUESTED = "Requested",
  APPROVED = "Approved",
  DISPATCHED = "Dispatched",
  IN_TRANSIT = "In Transit",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled",
  RETURNED = "Returned",
  HELD = "Held",
}

export interface IStatusLog {
  status: PARCEL_STATUS;
  location?: string;
  note?: string;
  updatedBy?: Types.ObjectId; // User ref
  timestamp?: Date;
}

export interface IParcelReceiver {
  user: Types.ObjectId;
  email: string;
  name: string;
  phone: string;
  address: string;
}

export interface IParcel {
  trackingId: string; // TRK-20250829-000001
  type: string; // Document, Box, Fragile etc.
  weight: number; // in KG
  deliveryCharge: number; // auto calculate or manual
  deliveryAddress: string;
  sender: Types.ObjectId;
  receiver: IParcelReceiver;
  currentStatus: PARCEL_STATUS;
  statusLogs: IStatusLog[];
  estimatedDelivery?: Date;
  isFlagged: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
