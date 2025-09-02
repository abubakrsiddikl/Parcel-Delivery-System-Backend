"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("../user/user.controller");
const zodRequestValidate_1 = require("../../middlewares/zodRequestValidate");
const user_validation_1 = require("./user.validation");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("./user.interface");
const router = (0, express_1.Router)();
//  create user
router.post("/register", (0, zodRequestValidate_1.zodRequestValidate)(user_validation_1.createUserZodSchema), user_controller_1.UserControllers.register);
// get all user
router.get("/all-users", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), user_controller_1.UserControllers.getAllUsers);
// get me
router.get("/me", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.UserControllers.getMe);
// update user
router.patch("/update/:id", (0, zodRequestValidate_1.zodRequestValidate)(user_validation_1.updateUserZodSchema), (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.UserControllers.updateUser);
exports.UserRoutes = router;
