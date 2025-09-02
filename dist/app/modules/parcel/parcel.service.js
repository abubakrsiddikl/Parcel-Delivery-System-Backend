"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = require("mongoose");
const parcel_interface_1 = require("./parcel.interface");
const parcel_model_1 = require("./parcel.model");
const generateTrackingId_1 = require("../../utils/generateTrackingId");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const parcel_constant_1 = require("./parcel.constant");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
//  Create Parcel
const createParcel = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiver } = payload, restPayload = __rest(payload, ["receiver"]);
    const receiverUserRoleCheck = yield user_model_1.User.findOne({
        email: receiver === null || receiver === void 0 ? void 0 : receiver.email,
    });
    if (!receiverUserRoleCheck) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver not found !");
    }
    if ((receiverUserRoleCheck === null || receiverUserRoleCheck === void 0 ? void 0 : receiverUserRoleCheck.role) !== user_interface_1.Role.RECEIVER) {
        throw new AppError_1.default(401, `Parcels can only be sent to users with the 'Receiver' role. The selected user has role '${receiverUserRoleCheck === null || receiverUserRoleCheck === void 0 ? void 0 : receiverUserRoleCheck.role}', so you cannot send a parcel to them.`);
    }
    // generate trackingId
    const trackingId = yield (0, generateTrackingId_1.generateTrackingId)();
    //  initial status log
    const initialStatusLog = {
        status: parcel_interface_1.PARCEL_STATUS.REQUESTED,
        location: "N/A",
        note: "Parcel requested by sender",
        updatedBy: new mongoose_1.Types.ObjectId(userId),
        timestamp: new Date(),
    };
    // include receiver valid _id
    const receiverInfo = {
        email: receiver === null || receiver === void 0 ? void 0 : receiver.email,
        user: receiverUserRoleCheck._id,
        name: receiver === null || receiver === void 0 ? void 0 : receiver.name,
        phone: receiver === null || receiver === void 0 ? void 0 : receiver.phone,
        address: receiver === null || receiver === void 0 ? void 0 : receiver.address,
    };
    const parcel = yield parcel_model_1.Parcel.create(Object.assign({ sender: userId, trackingId, statusLogs: [initialStatusLog], receiver: receiverInfo }, restPayload));
    return parcel;
});
//  Get My Parcels
const getMyParcels = (decodedToken, query) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.userId;
    let condition = {};
    let userType;
    if ((decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.role) === user_interface_1.Role.SENDER) {
        condition = { sender: userId };
        userType = user_interface_1.Role.SENDER;
    }
    else if ((decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.role) === user_interface_1.Role.RECEIVER) {
        condition = { "receiver.user": userId };
        userType = user_interface_1.Role.RECEIVER;
    }
    else {
        throw new AppError_1.default(403, "Not authorized to view parcels");
    }
    // query builder
    const queryBuilder = new QueryBuilder_1.QueryBuilder(parcel_model_1.Parcel.find(condition), query);
    const parcels = queryBuilder
        .search(parcel_constant_1.parcelSearchableFields)
        .filter()
        .sort()
        .paginate();
    const [rawData, meta] = yield Promise.all([
        parcels.build().populate("sender", "name email address phone"),
        queryBuilder.getMeta(),
    ]);
    //  Add "userType" only for sender/receiver
    const data = rawData.map((parcel) => userType ? Object.assign(Object.assign({}, parcel.toObject()), { userType }) : parcel.toObject());
    return { data, meta };
});
// Get All Parcels by Admin
const getAllParcels = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(parcel_model_1.Parcel.find(), query);
    const parcels = queryBuilder
        .search(parcel_constant_1.parcelSearchableFields)
        .filter()
        .sort()
        .paginate();
    // const meta = await queryBuilder.getMeta();
    const [data, meta] = yield Promise.all([
        parcels.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
// Get Parcel By ID
const getParcelById = (parcelId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId).populate("sender", "name email phone address");
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    // Role based validation
    if (decodedToken.role === user_interface_1.Role.SENDER &&
        parcel.sender._id.toString() !== decodedToken.userId) {
        throw new AppError_1.default(403, "You are not allowed to view this parcel");
    }
    if (decodedToken.role === user_interface_1.Role.RECEIVER &&
        parcel.receiver.user.toString() !== decodedToken.userId) {
        throw new AppError_1.default(403, "You are not allowed to view this parcel");
    }
    return parcel;
});
// update status by admin
const updateParcelStatus = (parcelId, newStatus, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const role = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.role;
    const userId = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.userId;
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel)
        throw new AppError_1.default(404, "Parcel not found");
    // Validation rules
    if (role === user_interface_1.Role.SENDER && newStatus === parcel_interface_1.PARCEL_STATUS.DELIVERED) {
        throw new AppError_1.default(403, "Sender cannot mark parcel as delivered");
    }
    if (role === user_interface_1.Role.RECEIVER && newStatus !== parcel_interface_1.PARCEL_STATUS.DELIVERED) {
        throw new AppError_1.default(403, "Receiver can only confirm delivery");
    }
    if (role === user_interface_1.Role.SENDER &&
        parcel.currentStatus === parcel_interface_1.PARCEL_STATUS.DISPATCHED) {
        throw new AppError_1.default(403, "Sender cannot cancel/discard once dispatched");
    }
    //  Status transition
    parcel.currentStatus = newStatus;
    //  Push status log
    parcel.statusLogs.push({
        status: newStatus,
        location: "System update", // later dynamically set
        note: `${role} updated status to ${newStatus}`,
        updatedBy: new mongoose_1.Types.ObjectId(userId),
        timestamp: new Date(),
    });
    yield parcel.save();
    return parcel;
});
// cancel parcel by only sender
const cancelParcel = (parcelId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.userId;
    const role = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.role;
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(404, "Parcel not found");
    }
    // cancel only sender
    if (role !== "sender" || parcel.sender.toString() !== userId.toString()) {
        throw new AppError_1.default(403, "You are not authorized to cancel this parcel");
    }
    // check current status
    if (parcel.currentStatus === parcel_interface_1.PARCEL_STATUS.DISPATCHED ||
        parcel.currentStatus === parcel_interface_1.PARCEL_STATUS.IN_TRANSIT ||
        parcel.currentStatus === parcel_interface_1.PARCEL_STATUS.DELIVERED ||
        parcel.currentStatus === parcel_interface_1.PARCEL_STATUS.CANCELLED) {
        throw new AppError_1.default(400, `Parcel cannot be cancelled at parcel already ${parcel.currentStatus}`);
    }
    // Status update
    parcel.currentStatus = parcel_interface_1.PARCEL_STATUS.CANCELLED;
    parcel.statusLogs.push({
        status: parcel_interface_1.PARCEL_STATUS.CANCELLED,
        note: `${role} updated status to ${parcel_interface_1.PARCEL_STATUS.CANCELLED}`,
        updatedBy: new mongoose_1.Types.ObjectId(userId),
        timestamp: new Date(),
    });
    yield parcel.save();
    return parcel;
});
// confirm delivery
const confirmDelivery = (parcelId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.userId;
    const role = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.role;
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(404, "Parcel not found");
    }
    // check role receiver
    if (role !== "receiver" ||
        parcel.receiver.user.toString() !== userId.toString()) {
        throw new AppError_1.default(403, "You are not authorized to confirm delivery of this parcel");
    }
    // check already delivered
    if (parcel.currentStatus === parcel_interface_1.PARCEL_STATUS.DELIVERED) {
        throw new AppError_1.default(400, `Parcel cannot be cancelled at parcel already Delivered`);
    }
    // check currentStatus
    if (parcel.currentStatus !== parcel_interface_1.PARCEL_STATUS.IN_TRANSIT &&
        parcel.currentStatus !== parcel_interface_1.PARCEL_STATUS.DISPATCHED) {
        throw new AppError_1.default(400, "Parcel is not ready for delivery confirmation");
    }
    parcel.currentStatus = parcel_interface_1.PARCEL_STATUS.DELIVERED;
    parcel.statusLogs.push({
        status: parcel_interface_1.PARCEL_STATUS.DELIVERED,
        note: `${role} updated status to ${parcel_interface_1.PARCEL_STATUS.DELIVERED}`,
        updatedBy: new mongoose_1.Types.ObjectId(userId),
        timestamp: new Date(),
    });
    yield parcel.save();
    return parcel;
});
// tracking parcel
const trackingParcel = (trackingId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findOne({ trackingId }).select("-_id statusLogs.status statusLogs.location statusLogs.timestamp");
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found !");
    }
    return parcel;
});
// Update Parcel Info
const updateParcelInfo = (parcelId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    // Role-based check (optional: only sender or admin can update)
    if (decodedToken.role === "sender" &&
        parcel.sender.toString() !== decodedToken.userId) {
        throw new AppError_1.default(403, "You are not authorized to update this parcel");
    }
    // Allowed fields to update
    const { type, weight, fee, estimatedDelivery, receiver } = payload;
    if (type !== undefined)
        parcel.type = type;
    if (weight !== undefined)
        parcel.weight = weight;
    if (fee !== undefined)
        parcel.fee = fee;
    if (estimatedDelivery !== undefined)
        parcel.estimatedDelivery = estimatedDelivery;
    // Receiver update (type-safe)
    if (receiver !== undefined) {
        const updatedReceiver = {
            user: receiver.user,
            email: receiver.email,
            name: receiver.name,
            phone: receiver.phone,
            address: receiver.address,
        };
        parcel.receiver = updatedReceiver;
    }
    // Save updated parcel
    yield parcel.save();
    return parcel;
});
exports.ParcelServices = {
    createParcel,
    getMyParcels,
    getAllParcels,
    getParcelById,
    updateParcelStatus,
    cancelParcel,
    confirmDelivery,
    trackingParcel,
    updateParcelInfo,
};
