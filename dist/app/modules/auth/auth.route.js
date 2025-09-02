"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
// login with credential
router.post("/login", auth_controller_1.AuthControllers.credentialLogin);
// get new accessToken use refresh token
router.post("/refresh-token", auth_controller_1.AuthControllers.getNewAccessToken);
// forgot password
router.post("/forgot-password", auth_controller_1.AuthControllers.forgotPassword);
// logout
router.post("/logout", auth_controller_1.AuthControllers.logout);
exports.AuthRoutes = router;
