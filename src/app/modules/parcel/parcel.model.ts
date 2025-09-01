import { model, Schema } from "mongoose";
import { IParcel, IStatusLog, PARCEL_STATUS } from "./parcel.interface";

const StatusLogSchema = new Schema<IStatusLog>(
  {
    status: {
      type: String,
      enum: Object.values(PARCEL_STATUS),
      required: true,
    },
    location: {
      type: String,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// parcel schema
const parcelSchema = new Schema<IParcel>(
  {
    trackingId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    fee: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      user: { type: Schema.Types.ObjectId, ref: "User" },
      email: { type: String, required: true },
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    currentStatus: {
      type: String,
      enum: Object.values(PARCEL_STATUS),
      default: PARCEL_STATUS.REQUESTED,
    },
    statusLogs: [StatusLogSchema],
    estimatedDelivery: {
      type: Date,
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// model
export const Parcel = model<IParcel>("Parcel", parcelSchema);
