import { Router } from "express";
import { UserControllers } from "../user/user.controller";
import { zodRequestValidate } from "../../middlewares/zodRequestValidate";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

//  create user
router.post(
  "/register",
  zodRequestValidate(createUserZodSchema),
  UserControllers.register
);

// get all user
router.get("/all-users", checkAuth(Role.ADMIN), UserControllers.getAllUsers);

// get me
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);

// update user
router.patch(
  "/update/:id",
  zodRequestValidate(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);

export const UserRoutes = router;
