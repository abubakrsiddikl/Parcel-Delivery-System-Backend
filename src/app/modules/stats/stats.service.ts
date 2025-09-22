/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import { Parcel } from "../parcel/parcel.model";
import { Role } from "../user/user.interface";
import { User } from "../user/user.model";
import mongoose from "mongoose";

const getDashboardStats = async (decodedToken: JwtPayload) => {
  const role = decodedToken?.role;
  const userId = decodedToken?.userId;

  // SENDER STATS
  if (role === Role.SENDER) {
    const [totalParcel, delivered, inTransit, pending, cancelled] =
      await Promise.all([
        Parcel.countDocuments({ sender: userId }),
        Parcel.countDocuments({ sender: userId, currentStatus: "Delivered" }),
        Parcel.countDocuments({
          sender: userId,
          currentStatus: { $in: ["Dispatched", "In Transit"] },
        }),
        Parcel.countDocuments({ sender: userId, currentStatus: "Requested" }),
        Parcel.countDocuments({ sender: userId, currentStatus: "Cancelled" }),
      ]);

    return {
      role,
      overview: { totalParcel, delivered, inTransit, pending, cancelled },
    };
  }

  // RECEIVER STATS
  if (role === Role.RECEIVER) {
    const [totalParcel, delivered, inTransit, pending] = await Promise.all([
      Parcel.countDocuments({ "receiver.user": userId }),
      Parcel.countDocuments({
        "receiver.user": userId,
        currentStatus: "Delivered",
      }),
      Parcel.countDocuments({
        "receiver.user": userId,
        currentStatus: { $in: ["Dispatched", "In Transit"] },
      }),
      Parcel.countDocuments({
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
  if (role === Role.ADMIN) {
    const [
      totalParcel,
      delivered,
      inTransit,
      pending,
      cancelled,
      flagged,
      totalUsers,
      senders,
      receivers,
      admins,
    ] = await Promise.all([
      Parcel.countDocuments(),
      Parcel.countDocuments({ currentStatus: "Delivered" }),
      Parcel.countDocuments({
        currentStatus: { $in: ["Dispatched", "In Transit"] },
      }),
      Parcel.countDocuments({ currentStatus: "Requested" }),
      Parcel.countDocuments({ currentStatus: "Cancelled" }),
      Parcel.countDocuments({ isFlagged: true }),

      User.countDocuments(),
      User.countDocuments({ role: Role.SENDER }),
      User.countDocuments({ role: Role.RECEIVER }),
      User.countDocuments({ role: Role.ADMIN }),
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
};

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
const getChartStats = async (decodedToken: JwtPayload) => {
  const role = decodedToken?.role;
  const userId = decodedToken?.userId;

  const matchQuery: any = {};

  if (role === Role.SENDER) {
    matchQuery.sender = new mongoose.Types.ObjectId(userId);
  } else if (role === Role.RECEIVER) {
    matchQuery["receiver.user"] = new mongoose.Types.ObjectId(userId);
  }

  //  DELIVERY STATUS DISTRIBUTION
  const statusDistribution = await Parcel.aggregate([
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
  const monthlyShipmentsRaw = await Parcel.aggregate([
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
};

export const StatsServices = {
  getDashboardStats,
  getChartStats,
};
