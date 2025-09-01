import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { ParcelControllers } from "./parcel.controller";
import { zodRequestValidate } from "../../middlewares/zodRequestValidate";
import { createParcelZodSchema } from "./parcel.validation";

const router = Router();

// create parcel by sender and admin
router.post(
  "/create",
  zodRequestValidate(createParcelZodSchema),
  checkAuth(Role.SENDER, Role.ADMIN),
  ParcelControllers.createParcel
);

// get parcel user by id
router.get(
  "/me",
  checkAuth(...Object.values(Role)),
  ParcelControllers.getMyParcels
);

// get parcel single parcel 
router.get("/:parcelId", checkAuth(...Object.values(Role)),ParcelControllers.getParcelById);

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

export const ParcelRoutes = router;
