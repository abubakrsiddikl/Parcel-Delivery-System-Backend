/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

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

// update user
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    const verifiedToken = req.user;

    const payload = req.body;
    const user = await UserServices.updateUser(
      userId,
      payload,
      verifiedToken as JwtPayload
    );
   

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Updated Successfully",
      data: user,
    });
  }
);
// get all users
const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "All Users Retrieved Successfully",
      data: result.data,
    });
  }
);

//  get me
const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await UserServices.getMe(decodedToken.userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Your Profile Retrieved Successfully",
      data: result.data,
    });
  }
);

export const UserControllers = {
  register,
  getAllUsers,
  getMe,
  updateUser,
};
