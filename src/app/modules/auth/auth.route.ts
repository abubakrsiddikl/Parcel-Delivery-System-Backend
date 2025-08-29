import { Router } from "express";
import { AuthServices } from "./auth.controller";

const router = Router();

// login with credential
router.post("/login", AuthServices.credentialLogin);

// logout
router.post("/logout", AuthServices.logout);

export const AuthRoutes = router;
