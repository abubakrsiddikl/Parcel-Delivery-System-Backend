"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const stats_controller_1 = require("./stats.controller");
const router = (0, express_1.Router)();
// Get Dashboard stats
router.get("/", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), stats_controller_1.StatsControllers.getDashboardStats);
exports.StatsRoutes = router;
