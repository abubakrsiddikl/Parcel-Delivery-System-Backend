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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const parcel_service_1 = require("./parcel.service");
//  Create Parcel
const createParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield parcel_service_1.ParcelServices.createParcel(decodedToken.userId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel created successfully",
        data: result,
    });
}));
//  Get My Parcels
const getMyParcels = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const decodedToken = req.user;
    const result = yield parcel_service_1.ParcelServices.getMyParcels(decodedToken, query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcels retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
// Get All Parcel By Admin
const getAllParcels = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield parcel_service_1.ParcelServices.getAllParcels(query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Parcels retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
//  Get Single Parcel
const getParcelById = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const { parcelId } = req.params;
    const result = yield parcel_service_1.ParcelServices.getParcelById(parcelId, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel retrieved successfully",
        data: result,
    });
}));
//  Update Parcel Status by Admin
const updateParcelStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { newStatus } = req.body;
    const decodedToken = req.user;
    const updatedParcel = yield parcel_service_1.ParcelServices.updateParcelStatus(id, newStatus, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Parcel status updated successfully",
        data: updatedParcel,
    });
}));
// parcel status cancel by only sender
const cancelParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const decodedToken = req.user;
    const cancelled = yield parcel_service_1.ParcelServices.cancelParcel(id, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Parcel cancelled successfully",
        data: cancelled,
    });
}));
// confirm delivery only receiver
const confirmDelivery = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const decodedToken = req.user;
    const delivered = yield parcel_service_1.ParcelServices.confirmDelivery(id, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Parcel marked as delivered successfully",
        data: delivered,
    });
}));
// parcel track
const trackingParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { trackingId } = req.params;
    const trackingInfo = yield parcel_service_1.ParcelServices.trackingParcel(trackingId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Parcel tracking info retrieved successfully",
        data: trackingInfo,
    });
}));
// update parcel info
const updateParcelInfo = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { parcelId } = req.params;
    const payload = req.body;
    const decodedToken = req.user;
    const updatedParcel = yield parcel_service_1.ParcelServices.updateParcelInfo(parcelId, payload, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Parcel updated successfully",
        data: updatedParcel,
    });
}));
exports.ParcelControllers = {
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
