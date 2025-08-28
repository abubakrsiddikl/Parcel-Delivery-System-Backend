import { Types } from "mongoose";

// role enum
export enum Role {
  ADMIN = "admin",
  SENDER = "sender",
  RECEIVER = "receiver",
}

//auth providers
export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

// user activate check
export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
  UNBLOCKED = "UNBLOCKED",
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: string;
  isActive?: IsActive;
  role: Role;
  auths: IAuthProvider[];
  createdAt?: Date;
}
