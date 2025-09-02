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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsServices = void 0;
const parcel_model_1 = require("../parcel/parcel.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const getDashboardStats = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const role = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.role;
    const userId = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.userId;
    //   get sender stats
    if (role === user_interface_1.Role.SENDER) {
        const totalParcelPromise = parcel_model_1.Parcel.countDocuments({ sender: userId });
        const deliveredPromise = parcel_model_1.Parcel.countDocuments({
            sender: userId,
            currentStatus: "Delivered",
        });
        const inTransitPromise = parcel_model_1.Parcel.countDocuments({
            sender: userId,
            currentStatus: { $in: ["Dispatched", "In Transit"] },
        });
        const pendingPromise = parcel_model_1.Parcel.countDocuments({
            sender: userId,
            currentStatus: "Requested",
        });
        const cancelledPromise = parcel_model_1.Parcel.countDocuments({
            sender: userId,
            currentStatus: "Cancelled",
        });
        const [totalParcel, delivered, inTransit, pending, cancelled] = yield Promise.all([
            totalParcelPromise,
            deliveredPromise,
            inTransitPromise,
            pendingPromise,
            cancelledPromise,
        ]);
        return { totalParcel, delivered, inTransit, pending, cancelled };
    }
    //   get receiver stats
    if (role === user_interface_1.Role.RECEIVER) {
        const totalParcelPromise = parcel_model_1.Parcel.countDocuments({
            "receiver.user": userId,
        });
        const deliveredPromise = parcel_model_1.Parcel.countDocuments({
            "receiver.user": userId,
            currentStatus: "Delivered",
        });
        const inTransitPromise = parcel_model_1.Parcel.countDocuments({
            "receiver.user": userId,
            currentStatus: { $in: ["Dispatched", "In Transit"] },
        });
        const pendingPromise = parcel_model_1.Parcel.countDocuments({
            "receiver.user": userId,
            currentStatus: "Requested",
        });
        const [totalParcel, delivered, inTransit, pending] = yield Promise.all([
            totalParcelPromise,
            deliveredPromise,
            inTransitPromise,
            pendingPromise,
        ]);
        return { totalParcel, delivered, inTransit, pending };
    }
    //   get admin stats
    if (role === user_interface_1.Role.ADMIN) {
        const totalParcelPromise = parcel_model_1.Parcel.countDocuments();
        const deliveredPromise = parcel_model_1.Parcel.countDocuments({
            currentStatus: "Delivered",
        });
        const inTransitPromise = parcel_model_1.Parcel.countDocuments({
            currentStatus: { $in: ["Dispatched", "In Transit"] },
        });
        const pendingPromise = parcel_model_1.Parcel.countDocuments({
            currentStatus: "Requested",
        });
        const cancelledPromise = parcel_model_1.Parcel.countDocuments({
            currentStatus: "Cancelled",
        });
        const flaggedPromise = parcel_model_1.Parcel.countDocuments({ isFlagged: true });
        const totalUsersPromise = user_model_1.User.countDocuments();
        const sendersPromise = user_model_1.User.countDocuments({ role: user_interface_1.Role.SENDER });
        const receiversPromise = user_model_1.User.countDocuments({ role: user_interface_1.Role.RECEIVER });
        const adminsPromise = user_model_1.User.countDocuments({ role: user_interface_1.Role.ADMIN });
        const [totalParcel, delivered, inTransit, pending, cancelled, flagged, totalUsers, senders, receivers, admins,] = yield Promise.all([
            totalParcelPromise,
            deliveredPromise,
            inTransitPromise,
            pendingPromise,
            cancelledPromise,
            flaggedPromise,
            totalUsersPromise,
            sendersPromise,
            receiversPromise,
            adminsPromise,
        ]);
        return {
            totalParcel,
            delivered,
            inTransit,
            pending,
            cancelled,
            flagged,
            users: { totalUsers, senders, receivers, admins },
        };
    }
});
exports.StatsServices = {
    getDashboardStats,
};
