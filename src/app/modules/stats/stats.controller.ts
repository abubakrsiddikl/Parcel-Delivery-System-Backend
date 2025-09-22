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

const getChartStats = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const result = await StatsServices.getChartStats(decodedToken);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Chart stats fetched successfully",
    data: result,
  });
});

export const StatsControllers = {
  getDashboardStats,
  getChartStats,
};
