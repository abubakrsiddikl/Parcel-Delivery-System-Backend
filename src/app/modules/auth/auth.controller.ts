/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import passport from "passport";
import AppError from "../../errorHelpers/AppError";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      // check any error
      if (err) {
        return next(new AppError(401, err));
      }
      // check user exists
      if (!user) {
        return next(new AppError(401, info.message));
      }
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        data: {
          //   accessToken: userTokens.accessToken,
          //   refreshToken: userTokens.refreshToken,
          //   user: rest,
          user,
        },
      });
    })(req, res, next);
  }
);

export const AuthServices = {
  credentialLogin,
};
