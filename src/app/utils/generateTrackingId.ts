import dayjs from "dayjs";
import { Parcel } from "../modules/parcel/parcel.model";

export const generateTrackingId = async () => {
  const today = dayjs().format("YYYYMMDD"); // 20250813
  const parcelCount = (await Parcel.countDocuments()) + 1;
  const paddedNumber = String(parcelCount).padStart(4, "0");
  return `TRK-${today}-${paddedNumber}`;
};
