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
exports.StatsServices = void 0;
const parcel_model_1 = require("../parcel/parcel.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
const getDashboardStats = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const role = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.role;
    const userId = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.userId;
    // SENDER STATS
    if (role === user_interface_1.Role.SENDER) {
        const [totalParcel, delivered, inTransit, pending, cancelled] = yield Promise.all([
            parcel_model_1.Parcel.countDocuments({ sender: userId }),
            parcel_model_1.Parcel.countDocuments({ sender: userId, currentStatus: "Delivered" }),
            parcel_model_1.Parcel.countDocuments({
                sender: userId,
                currentStatus: { $in: ["Dispatched", "In Transit"] },
            }),
            parcel_model_1.Parcel.countDocuments({ sender: userId, currentStatus: "Requested" }),
            parcel_model_1.Parcel.countDocuments({ sender: userId, currentStatus: "Cancelled" }),
        ]);
        return {
            role,
            overview: { totalParcel, delivered, inTransit, pending, cancelled },
        };
    }
    // RECEIVER STATS
    if (role === user_interface_1.Role.RECEIVER) {
        const [totalParcel, delivered, inTransit, pending] = yield Promise.all([
            parcel_model_1.Parcel.countDocuments({ "receiver.user": userId }),
            parcel_model_1.Parcel.countDocuments({
                "receiver.user": userId,
                currentStatus: "Delivered",
            }),
            parcel_model_1.Parcel.countDocuments({
                "receiver.user": userId,
                currentStatus: { $in: ["Dispatched", "In Transit"] },
            }),
            parcel_model_1.Parcel.countDocuments({
                "receiver.user": userId,
                currentStatus: "Requested",
            }),
        ]);
        return {
            role,
            overview: { totalParcel, delivered, inTransit, pending },
        };
    }
    //  ADMIN STATS
    if (role === user_interface_1.Role.ADMIN) {
        const [totalParcel, delivered, inTransit, pending, cancelled, flagged, totalUsers, senders, receivers, admins,] = yield Promise.all([
            parcel_model_1.Parcel.countDocuments(),
            parcel_model_1.Parcel.countDocuments({ currentStatus: "Delivered" }),
            parcel_model_1.Parcel.countDocuments({
                currentStatus: { $in: ["Dispatched", "In Transit"] },
            }),
            parcel_model_1.Parcel.countDocuments({ currentStatus: "Requested" }),
            parcel_model_1.Parcel.countDocuments({ currentStatus: "Cancelled" }),
            parcel_model_1.Parcel.countDocuments({ isFlagged: true }),
            user_model_1.User.countDocuments(),
            user_model_1.User.countDocuments({ role: user_interface_1.Role.SENDER }),
            user_model_1.User.countDocuments({ role: user_interface_1.Role.RECEIVER }),
            user_model_1.User.countDocuments({ role: user_interface_1.Role.ADMIN }),
        ]);
        return {
            role,
            overview: {
                totalParcel,
                delivered,
                inTransit,
                pending,
                cancelled,
                flagged,
            },
            users: {
                totalUsers,
                senders,
                receivers,
                admins,
            },
        };
    }
    return { message: "Invalid role or unauthorized access" };
});
// Helper: Month Number → Month Name
const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
//  CHART STATS
const getChartStats = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const role = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.role;
    const userId = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.userId;
    const matchQuery = {};
    if (role === user_interface_1.Role.SENDER) {
        matchQuery.sender = new mongoose_1.default.Types.ObjectId(userId);
    }
    else if (role === user_interface_1.Role.RECEIVER) {
        matchQuery["receiver.user"] = new mongoose_1.default.Types.ObjectId(userId);
    }
    //  DELIVERY STATUS DISTRIBUTION
    const statusDistribution = yield parcel_model_1.Parcel.aggregate([
        { $match: matchQuery },
        {
            $group: {
                _id: "$currentStatus",
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                status: "$_id",
                count: 1,
                _id: 0,
            },
        },
    ]);
    // MONTHLY SHIPMENTS TREND
    const monthlyShipmentsRaw = yield parcel_model_1.Parcel.aggregate([
        { $match: matchQuery },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                },
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                year: "$_id.year",
                month: "$_id.month",
                count: 1,
                _id: 0,
            },
        },
        { $sort: { year: 1, month: 1 } },
    ]);
    // Convert month number → month name
    const monthlyShipments = monthlyShipmentsRaw.map((item) => ({
        year: item.year,
        month: MONTH_NAMES[item.month - 1],
        count: item.count,
    }));
    return {
        role,
        statusDistribution,
        monthlyShipments,
    };
});
exports.StatsServices = {
    getDashboardStats,
    getChartStats,
};
