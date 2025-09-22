"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusFlow = exports.statusTransitions = void 0;
// src/modules/parcel/constants/transitions.constants.ts
const user_interface_1 = require("../../user/user.interface"); // adjust path as needed
const parcel_interface_1 = require("../parcel.interface");
// role  (target) allowed
exports.statusTransitions = {
    [user_interface_1.Role.ADMIN]: [
        parcel_interface_1.PARCEL_STATUS.APPROVED,
        parcel_interface_1.PARCEL_STATUS.DISPATCHED,
        parcel_interface_1.PARCEL_STATUS.IN_TRANSIT,
        parcel_interface_1.PARCEL_STATUS.DELIVERED,
        parcel_interface_1.PARCEL_STATUS.CANCELLED,
        parcel_interface_1.PARCEL_STATUS.RETURNED,
        parcel_interface_1.PARCEL_STATUS.HELD,
    ],
    [user_interface_1.Role.SENDER]: [parcel_interface_1.PARCEL_STATUS.CANCELLED], // sender just cancelled
    [user_interface_1.Role.RECEIVER]: [parcel_interface_1.PARCEL_STATUS.DELIVERED, parcel_interface_1.PARCEL_STATUS.RETURNED],
};
// strict sequence flow: current -> allowed next's
exports.statusFlow = {
    [parcel_interface_1.PARCEL_STATUS.REQUESTED]: [parcel_interface_1.PARCEL_STATUS.APPROVED, parcel_interface_1.PARCEL_STATUS.CANCELLED],
    [parcel_interface_1.PARCEL_STATUS.APPROVED]: [parcel_interface_1.PARCEL_STATUS.DISPATCHED, parcel_interface_1.PARCEL_STATUS.CANCELLED],
    [parcel_interface_1.PARCEL_STATUS.DISPATCHED]: [parcel_interface_1.PARCEL_STATUS.IN_TRANSIT],
    [parcel_interface_1.PARCEL_STATUS.IN_TRANSIT]: [parcel_interface_1.PARCEL_STATUS.DELIVERED, parcel_interface_1.PARCEL_STATUS.RETURNED],
    [parcel_interface_1.PARCEL_STATUS.DELIVERED]: [],
    [parcel_interface_1.PARCEL_STATUS.CANCELLED]: [],
    [parcel_interface_1.PARCEL_STATUS.RETURNED]: [],
    [parcel_interface_1.PARCEL_STATUS.HELD]: [parcel_interface_1.PARCEL_STATUS.APPROVED, parcel_interface_1.PARCEL_STATUS.CANCELLED],
};
