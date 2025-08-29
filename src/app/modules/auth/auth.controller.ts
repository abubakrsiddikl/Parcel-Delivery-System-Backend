/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import passport from "passport";
import AppError from "../../errorHelpers/AppError";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { createUserToken } from "../../utils/userTokens";
import { setAuthCookie } from "../../utils/setCookie";

// login
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
      const userTokens = createUserToken(user);
      setAuthCookie(res, userTokens);
      const { password: pass, ...rest } = user.toObject();
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        data: {
          accessToken: userTokens.accessToken,
          //   refreshToken: userTokens.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged Out Successfully",
      data: null,
    });
  }
);
export const AuthServices = {
  credentialLogin,
  logout,
};
