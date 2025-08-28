import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

// Register new user
const register = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.register(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Your Profile Retrieved Successfully",
    data: result,
  });
});

// Get own profile
const getProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getProfile("");
  res.json(result);
});

// Get all users (Admin)
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUsers();
  res.json(result);
});

// Get single user (Admin)
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getUserById(req.params.id);
  res.json(result);
});

// Update user
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.updateUser(req.params.id, req.body);
  res.json(result);
});

// Delete user
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.deleteUser(req.params.id);
  res.json(result);
});

export const UserControllers = {
  register,
  getProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
