import { JwtPayload } from "jsonwebtoken";
import { Parcel } from "../parcel/parcel.model";
import { Role } from "../user/user.interface";
import { User } from "../user/user.model";

const getDashboardStats = async (decodedToken: JwtPayload) => {
  const role = decodedToken?.role;
  const userId = decodedToken?.userId;

//   get sender stats
  if (role === Role.SENDER) {
    const totalParcelPromise = Parcel.countDocuments({ sender: userId });
    const deliveredPromise = Parcel.countDocuments({
      sender: userId,
      currentStatus: "Delivered",
    });
    const inTransitPromise = Parcel.countDocuments({
      sender: userId,
      currentStatus: { $in: ["Dispatched", "In Transit"] },
    });
    const pendingPromise = Parcel.countDocuments({
      sender: userId,
      currentStatus: "Requested",
    });
    const cancelledPromise = Parcel.countDocuments({
      sender: userId,
      currentStatus: "Cancelled",
    });

    const [totalParcel, delivered, inTransit, pending, cancelled] =
      await Promise.all([
        totalParcelPromise,
        deliveredPromise,
        inTransitPromise,
        pendingPromise,
        cancelledPromise,
      ]);

    return { totalParcel, delivered, inTransit, pending, cancelled };
  }

//   get receiver stats
  if (role === Role.RECEIVER) {
    const totalParcelPromise = Parcel.countDocuments({
      "receiver.user": userId,
    });
    const deliveredPromise = Parcel.countDocuments({
      "receiver.user": userId,
      currentStatus: "Delivered",
    });
    const inTransitPromise = Parcel.countDocuments({
      "receiver.user": userId,
      currentStatus: { $in: ["Dispatched", "In Transit"] },
    });
    const pendingPromise = Parcel.countDocuments({
      "receiver.user": userId,
      currentStatus: "Requested",
    });

    const [totalParcel, delivered, inTransit, pending] = await Promise.all([
      totalParcelPromise,
      deliveredPromise,
      inTransitPromise,
      pendingPromise,
    ]);

    return { totalParcel, delivered, inTransit, pending };
  }

//   get admin stats
  if (role === Role.ADMIN) {
    const totalParcelPromise = Parcel.countDocuments();
    const deliveredPromise = Parcel.countDocuments({
      currentStatus: "Delivered",
    });
    const inTransitPromise = Parcel.countDocuments({
      currentStatus: { $in: ["Dispatched", "In Transit"] },
    });
    const pendingPromise = Parcel.countDocuments({
      currentStatus: "Requested",
    });
    const cancelledPromise = Parcel.countDocuments({
      currentStatus: "Cancelled",
    });
    const flaggedPromise = Parcel.countDocuments({ isFlagged: true });

    const totalUsersPromise = User.countDocuments();
    const sendersPromise = User.countDocuments({ role: Role.SENDER });
    const receiversPromise = User.countDocuments({ role: Role.RECEIVER });
    const adminsPromise = User.countDocuments({ role: Role.ADMIN });

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
};

export const StatsServices = {
  getDashboardStats,
};
