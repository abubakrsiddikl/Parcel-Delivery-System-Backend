import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const router = Router();

// login with credential
router.post("/login", AuthControllers.credentialLogin);

// get new accessToken use refresh token
router.post("/refresh-token", AuthControllers.getNewAccessToken);

// forgot password
router.post("/forgot-password", AuthControllers.forgotPassword)

// logout
router.post("/logout", AuthControllers.logout);

export const AuthRoutes = router;
