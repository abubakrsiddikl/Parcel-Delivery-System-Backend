"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusNotes = exports.FINAL_STATUSES = void 0;
const parcel_interface_1 = require("../parcel.interface");
exports.FINAL_STATUSES = [
    parcel_interface_1.PARCEL_STATUS.DELIVERED,
    parcel_interface_1.PARCEL_STATUS.CANCELLED,
    parcel_interface_1.PARCEL_STATUS.RETURNED,
];
exports.statusNotes = {
    [parcel_interface_1.PARCEL_STATUS.REQUESTED]: "Parcel request submitted",
    [parcel_interface_1.PARCEL_STATUS.APPROVED]: "Parcel approved for processing",
    [parcel_interface_1.PARCEL_STATUS.DISPATCHED]: "Parcel dispatched to courier",
    [parcel_interface_1.PARCEL_STATUS.IN_TRANSIT]: "Parcel is in transit",
    [parcel_interface_1.PARCEL_STATUS.DELIVERED]: "Parcel successfully delivered",
    [parcel_interface_1.PARCEL_STATUS.CANCELLED]: "Parcel has been cancelled",
    [parcel_interface_1.PARCEL_STATUS.RETURNED]: "Parcel returned to sender",
    [parcel_interface_1.PARCEL_STATUS.HELD]: "Parcel is on hold for review",
};
