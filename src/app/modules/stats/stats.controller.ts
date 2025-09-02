/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { StatsServices } from "./stats.service";

const getDashboardStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const stats = await StatsServices.getDashboardStats(decodedToken);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Dashboard stats fetched successfully",
      data: stats,
    });
  }
);

export const StatsControllers = {
  getDashboardStats,
};
