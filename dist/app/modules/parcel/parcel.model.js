"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = void 0;
const mongoose_1 = require("mongoose");
const parcel_interface_1 = require("./parcel.interface");
const StatusLogSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.PARCEL_STATUS),
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, { _id: false });
// parcel schema
const parcelSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
        email: { type: String, required: true },
        name: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
    },
    currentStatus: {
        type: String,
        enum: Object.values(parcel_interface_1.PARCEL_STATUS),
        default: parcel_interface_1.PARCEL_STATUS.REQUESTED,
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
}, { timestamps: true });
// model
exports.Parcel = (0, mongoose_1.model)("Parcel", parcelSchema);
