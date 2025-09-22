"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const parcel_controller_1 = require("./parcel.controller");
const zodRequestValidate_1 = require("../../middlewares/zodRequestValidate");
const parcel_validation_1 = require("./parcel.validation");
const router = (0, express_1.Router)();
// create parcel by sender and admin
router.post("/create", (0, zodRequestValidate_1.zodRequestValidate)(parcel_validation_1.createParcelZodSchema), (0, checkAuth_1.checkAuth)(user_interface_1.Role.SENDER, user_interface_1.Role.ADMIN), parcel_controller_1.ParcelControllers.createParcel);
// get all parcel user by match her id can use sender and receiver only
router.get("/me", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), parcel_controller_1.ParcelControllers.getMyParcels);
// get all parcel by only admin
router.get("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), parcel_controller_1.ParcelControllers.getAllParcels);
// get  single parcel
router.get("/:parcelId", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), parcel_controller_1.ParcelControllers.getParcelById);
// tracking parcel on public
router.get("/track/:trackingId", parcel_controller_1.ParcelControllers.trackingParcel);
// update parcel status by admin
router.patch("/:id/status", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SENDER, user_interface_1.Role.RECEIVER), parcel_controller_1.ParcelControllers.updateParcelStatus);
// parcel status cancel only sender
router.patch("/cancel/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SENDER), parcel_controller_1.ParcelControllers.cancelParcel);
// parcel status cancel only sender
router.patch("/confirm-delivery/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RECEIVER), parcel_controller_1.ParcelControllers.confirmDelivery);
// update parcel info
router.patch("/update/:parcelId", (0, zodRequestValidate_1.zodRequestValidate)(parcel_validation_1.updateParcelZodSchema), (0, checkAuth_1.checkAuth)(user_interface_1.Role.SENDER, user_interface_1.Role.ADMIN), parcel_controller_1.ParcelControllers.updateParcelInfo);
exports.ParcelRoutes = router;
