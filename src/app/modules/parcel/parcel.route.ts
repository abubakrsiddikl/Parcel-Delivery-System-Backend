import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { ParcelControllers } from "./parcel.controller";
import { zodRequestValidate } from "../../middlewares/zodRequestValidate";
import {
  createParcelZodSchema,
  updateParcelZodSchema,
} from "./parcel.validation";

const router = Router();

// create parcel by sender and admin
router.post(
  "/create",
  zodRequestValidate(createParcelZodSchema),
  checkAuth(Role.SENDER, Role.ADMIN),
  ParcelControllers.createParcel
);

// get all parcel user by match her id can use sender and receiver only
router.get(
  "/me",
  checkAuth(...Object.values(Role)),
  ParcelControllers.getMyParcels
);

// get all parcel by only admin
router.get("/", checkAuth(Role.ADMIN), ParcelControllers.getAllParcels);

// get  single parcel
router.get(
  "/:parcelId",
  checkAuth(...Object.values(Role)),
  ParcelControllers.getParcelById
);

// tracking parcel on public
router.get("/track/:trackingId", ParcelControllers.trackingParcel);

// update parcel status by admin
router.patch(
  "/:id/status",
  checkAuth(Role.ADMIN),
  ParcelControllers.updateParcelStatus
);

// parcel status cancel only sender
router.patch(
  "/cancel/:id",
  checkAuth(Role.SENDER),
  ParcelControllers.cancelParcel
);

// parcel status cancel only sender
router.patch(
  "/confirm-delivery/:id",
  checkAuth(Role.RECEIVER),
  ParcelControllers.confirmDelivery
);

// update parcel info
router.patch(
  "/update/:parcelId",
  zodRequestValidate(updateParcelZodSchema),
  checkAuth(Role.SENDER, Role.ADMIN),
  ParcelControllers.updateParcelInfo
);

export const ParcelRoutes = router;
