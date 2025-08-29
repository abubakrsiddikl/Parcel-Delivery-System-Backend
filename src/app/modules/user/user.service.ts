import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { User } from "./user.model";

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

const getProfile = async (user: any) => {
  return;
};

const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

const getUserById = async (id: string) => {
  return;
};

const updateUser = async (id: string, data: any) => {
  return;
};

const deleteUser = async (id: string) => {
  return;
};

export const UserServices = {
  register,
  getProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
