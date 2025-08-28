import { Router } from "express";
import { UserControllers } from "../user/user.controller";
import { zodRequestValidate } from "../../middlewares/zodRequestValidate";
import { createUserZodSchema } from "./user.validation";

const router = Router();

//  create user
router.post(
  "/register",
  zodRequestValidate(createUserZodSchema),
  UserControllers.register
);

// get all user
router.get("/", UserControllers.getAllUsers);
// get single user
router.get("/:id", UserControllers.getUserById);

// update user
router.patch("/:id", UserControllers.updateUser);

// delete a user
router.delete("/:id", UserControllers.deleteUser);

export const UserRoutes = router;
