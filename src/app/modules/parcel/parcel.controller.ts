/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ParcelServices } from "./parcel.service";
import { JwtPayload } from "jsonwebtoken";

//  Create Parcel
const createParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await ParcelServices.createParcel(
      decodedToken.userId,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Parcel created successfully",
      data: result,
    });
  }
);

//  Get My Parcels
const getMyParcels = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await ParcelServices.getMyParcels(decodedToken.userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcels retrieved successfully",
      data: result.data,
    });
  }
);

//  Get Single Parcel
const getParcelById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const { parcelId } = req.params;
    const result = await ParcelServices.getParcelById(parcelId, decodedToken);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcel retrieved successfully",
      data: result,
    });
  }
);

//  Update Parcel Status by Admin
const updateParcelStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { newStatus } = req.body;
  const decodedToken = req.user as JwtPayload;

  const updatedParcel = await ParcelServices.updateParcelStatus(
    id,
    newStatus,
    decodedToken
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Parcel status updated successfully",
    data: updatedParcel,
  });
});

// parcel status cancel by only sender
const cancelParcel = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const decodedToken = req.user as JwtPayload;

  const cancelled = await ParcelServices.cancelParcel(id, decodedToken);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Parcel cancelled successfully",
    data: cancelled,
  });
});

// confirm delivery only receiver
const confirmDelivery = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const decodedToken = req.user as JwtPayload;

  const delivered = await ParcelServices.confirmDelivery(id, decodedToken);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Parcel marked as delivered successfully",
    data: delivered,
  });
});

// parcel track
const trackingParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { trackingId } = req.params;
    const trackingInfo = await ParcelServices.trackingParcel(trackingId);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Parcel tracking info retrieved successfully",
      data: trackingInfo,
    });
  }
);
export const ParcelControllers = {
  createParcel,
  getMyParcels,
  getParcelById,
  updateParcelStatus,
  cancelParcel,
  confirmDelivery,
  trackingParcel,
};
