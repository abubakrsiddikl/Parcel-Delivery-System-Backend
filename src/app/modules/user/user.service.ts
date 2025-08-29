import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { User } from "./user.model";
import { JwtPayload } from "jsonwebtoken";

// user service
const register = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

// update user
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  //  Check if user exists
  const ifUserExist = await User.findById(userId);
  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  //  Normal users (SENDER/RECEIVER) can only update their own profile
  if (
    (decodedToken.role === Role.SENDER ||
      decodedToken.role === Role.RECEIVER) &&
    userId !== decodedToken.userId
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to update others."
    );
  }

  //  Restrict SENDER/RECEIVER from changing role, isActive, isDeleted
  if (
    decodedToken.role === Role.SENDER ||
    decodedToken.role === Role.RECEIVER
  ) {
    if (payload.role || payload.isActive || payload.isDeleted) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to change role or status."
      );
    }
  }

  //  Admin or higher roles can update anything
  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

// get all users
const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

//  get Me
const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  return {
    data: user,
  };
};

export const UserServices = {
  register,
  getMe,
  getAllUsers,
  updateUser,
};
