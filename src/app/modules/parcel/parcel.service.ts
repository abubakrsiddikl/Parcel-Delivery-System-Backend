/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";
import { IParcel, IParcelReceiver, PARCEL_STATUS } from "./parcel.interface";
import { Parcel } from "./parcel.model";
import { generateTrackingId } from "../../utils/generateTrackingId";
import AppError from "../../errorHelpers/AppError";
import { Role } from "../user/user.interface";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import { parcelSearchableFields } from "./parcel.constant";
import { QueryBuilder } from "../../utils/QueryBuilder";

//  Create Parcel
const createParcel = async (userId: string, payload: Partial<IParcel>) => {
  const { receiver, ...restPayload } = payload;
  const receiverUserRoleCheck = await User.findOne({
    email: receiver?.email,
  });
  if (!receiverUserRoleCheck) {
    throw new AppError(httpStatus.NOT_FOUND, "Receiver not found !");
  }
  if (receiverUserRoleCheck?.role !== Role.RECEIVER) {
    throw new AppError(
      401,
      `Parcels can only be sent to users with the 'Receiver' role. The selected user has role '${receiverUserRoleCheck?.role}', so you cannot send a parcel to them.`
    );
  }

  // generate trackingId
  const trackingId = await generateTrackingId();

  //  initial status log
  const initialStatusLog = {
    status: PARCEL_STATUS.REQUESTED,
    location: "N/A",
    note: "Parcel requested by sender",
    updatedBy: new Types.ObjectId(userId),
    timestamp: new Date(),
  };

  // include receiver valid _id
  const receiverInfo: IParcelReceiver = {
    email: receiver?.email as string,
    user: receiverUserRoleCheck._id,
    name: receiver?.name as string,
    phone: receiver?.phone as string,
    address: receiver?.address as string,
  };

  const parcel = await Parcel.create({
    sender: userId,
    trackingId,
    statusLogs: [initialStatusLog],
    receiver: receiverInfo,
    ...restPayload,
  });

  return parcel;
};

//  Get My Parcels
const getMyParcels = async (
  decodedToken: JwtPayload,
  query: Record<string, string>
) => {
  const userId = decodedToken?.userId;
  let condition = {};
  let userType: Role;

  if (decodedToken?.role === Role.SENDER) {
    condition = { sender: userId };
    userType = Role.SENDER;
  } else if (decodedToken?.role === Role.RECEIVER) {
    condition = { "receiver.user": userId };
    userType = Role.RECEIVER;
  } else {
    throw new AppError(403, "Not authorized to view parcels");
  }

  // query builder
  const queryBuilder = new QueryBuilder(Parcel.find(condition), query);

  const parcels = queryBuilder
    .search(parcelSearchableFields)
    .filter()
    .sort()
    .paginate();

  const [rawData, meta] = await Promise.all([
    parcels.build().populate("sender", "name email address phone"),
    queryBuilder.getMeta(),
  ]);

  //  Add "userType" only for sender/receiver
  const data = rawData.map((parcel: any) =>
    userType ? { ...parcel.toObject(), userType } : parcel.toObject()
  );

  return { data, meta };
};

// Get All Parcels by Admin
const getAllParcels = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Parcel.find(), query);

  const parcels = queryBuilder
    .search(parcelSearchableFields)
    .filter()
    .sort()
    .paginate();

  // const meta = await queryBuilder.getMeta();
  const [data, meta] = await Promise.all([
    parcels.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};
// Get Parcel By ID
const getParcelById = async (parcelId: string, decodedToken: JwtPayload) => {
  const parcel = await Parcel.findById(parcelId).populate(
    "sender",
    "name email phone address"
  );
  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
  }

  // Role based validation
  if (
    decodedToken.role === Role.SENDER &&
    parcel.sender._id.toString() !== decodedToken.userId
  ) {
    throw new AppError(403, "You are not allowed to view this parcel");
  }

  if (
    decodedToken.role === Role.RECEIVER &&
    parcel.receiver.user.toString() !== decodedToken.userId
  ) {
    throw new AppError(403, "You are not allowed to view this parcel");
  }

  return parcel;
};

// update status by admin
const updateParcelStatus = async (
  parcelId: string,
  newStatus: PARCEL_STATUS,
  decodedToken: JwtPayload
) => {
  const role = decodedToken?.role;
  const userId = decodedToken?.userId;
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new AppError(404, "Parcel not found");

  // Validation rules
  if (role === Role.SENDER && newStatus === PARCEL_STATUS.DELIVERED) {
    throw new AppError(403, "Sender cannot mark parcel as delivered");
  }
  if (role === Role.RECEIVER && newStatus !== PARCEL_STATUS.DELIVERED) {
    throw new AppError(403, "Receiver can only confirm delivery");
  }
  if (
    role === Role.SENDER &&
    parcel.currentStatus === PARCEL_STATUS.DISPATCHED
  ) {
    throw new AppError(403, "Sender cannot cancel/discard once dispatched");
  }

  //  Status transition
  parcel.currentStatus = newStatus;

  //  Push status log
  parcel.statusLogs.push({
    status: newStatus,
    location: "System update", // later dynamically set
    note: `${role} updated status to ${newStatus}`,
    updatedBy: new Types.ObjectId(userId),
    timestamp: new Date(),
  });

  await parcel.save();
  return parcel;
};

// cancel parcel by only sender
const cancelParcel = async (parcelId: string, decodedToken: JwtPayload) => {
  const userId = decodedToken?.userId;
  const role = decodedToken?.role;
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) {
    throw new AppError(404, "Parcel not found");
  }
  // cancel only sender
  if (role !== "sender" || parcel.sender.toString() !== userId.toString()) {
    throw new AppError(403, "You are not authorized to cancel this parcel");
  }

  // check current status
  if (
    parcel.currentStatus === PARCEL_STATUS.DISPATCHED ||
    parcel.currentStatus === PARCEL_STATUS.IN_TRANSIT ||
    parcel.currentStatus === PARCEL_STATUS.DELIVERED ||
    parcel.currentStatus === PARCEL_STATUS.CANCELLED
  ) {
    throw new AppError(
      400,
      `Parcel cannot be cancelled at parcel already ${parcel.currentStatus}`
    );
  }

  // Status update
  parcel.currentStatus = PARCEL_STATUS.CANCELLED;
  parcel.statusLogs.push({
    status: PARCEL_STATUS.CANCELLED,
    note: `${role} updated status to ${PARCEL_STATUS.CANCELLED}`,
    updatedBy: new Types.ObjectId(userId),
    timestamp: new Date(),
  });

  await parcel.save();
  return parcel;
};

// confirm delivery
const confirmDelivery = async (parcelId: string, decodedToken: JwtPayload) => {
  const userId = decodedToken?.userId;
  const role = decodedToken?.role;
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) {
    throw new AppError(404, "Parcel not found");
  }

  // check role receiver
  if (
    role !== "receiver" ||
    parcel.receiver.user.toString() !== userId.toString()
  ) {
    throw new AppError(
      403,
      "You are not authorized to confirm delivery of this parcel"
    );
  }

  // check already delivered
  if (parcel.currentStatus === PARCEL_STATUS.DELIVERED) {
    throw new AppError(
      400,
      `Parcel cannot be cancelled at parcel already Delivered`
    );
  }
  // check currentStatus
  if (
    parcel.currentStatus !== PARCEL_STATUS.IN_TRANSIT &&
    parcel.currentStatus !== PARCEL_STATUS.DISPATCHED
  ) {
    throw new AppError(400, "Parcel is not ready for delivery confirmation");
  }

  parcel.currentStatus = PARCEL_STATUS.DELIVERED;
  parcel.statusLogs.push({
    status: PARCEL_STATUS.DELIVERED,
    note: `${role} updated status to ${PARCEL_STATUS.DELIVERED}`,
    updatedBy: new Types.ObjectId(userId),
    timestamp: new Date(),
  });

  await parcel.save();
  return parcel;
};

// tracking parcel
const trackingParcel = async (trackingId: string) => {
  const parcel = await Parcel.findOne({ trackingId }).select(
    "-_id statusLogs.status statusLogs.location statusLogs.timestamp"
  );
  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found !");
  }

  return parcel;
};

// Update Parcel Info
const updateParcelInfo = async (
  parcelId: string,
  payload: Partial<IParcel>,
  decodedToken: JwtPayload
) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
  }

  // Role-based check (optional: only sender or admin can update)
  if (
    decodedToken.role === "sender" &&
    parcel.sender.toString() !== decodedToken.userId
  ) {
    throw new AppError(403, "You are not authorized to update this parcel");
  }

  // Allowed fields to update
  const { type, weight, fee, estimatedDelivery, receiver } = payload;

  if (type !== undefined) parcel.type = type;
  if (weight !== undefined) parcel.weight = weight;
  if (fee !== undefined) parcel.fee = fee;
  if (estimatedDelivery !== undefined)
    parcel.estimatedDelivery = estimatedDelivery;

  // Receiver update (type-safe)
  if (receiver !== undefined) {
    const updatedReceiver: IParcelReceiver = {
      user: receiver.user,
      email: receiver.email,
      name: receiver.name,
      phone: receiver.phone,
      address: receiver.address,
    };
    parcel.receiver = updatedReceiver;
  }

  // Save updated parcel
  await parcel.save();

  return parcel;
};

export const ParcelServices = {
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
