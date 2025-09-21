import { PARCEL_STATUS } from "../parcel.interface";



export const FINAL_STATUSES = [
  PARCEL_STATUS.DELIVERED,
  PARCEL_STATUS.CANCELLED,
  PARCEL_STATUS.RETURNED,
] as const;

export const statusNotes: Record<PARCEL_STATUS, string> = {
  [PARCEL_STATUS.REQUESTED]: "Parcel request submitted",
  [PARCEL_STATUS.APPROVED]: "Parcel approved for processing",
  [PARCEL_STATUS.DISPATCHED]: "Parcel dispatched to courier",
  [PARCEL_STATUS.IN_TRANSIT]: "Parcel is in transit",
  [PARCEL_STATUS.DELIVERED]: "Parcel successfully delivered",
  [PARCEL_STATUS.CANCELLED]: "Parcel has been cancelled",
  [PARCEL_STATUS.RETURNED]: "Parcel returned to sender",
  [PARCEL_STATUS.HELD]: "Parcel is on hold for review",
};
