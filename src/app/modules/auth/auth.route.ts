import { Router } from "express";
import { AuthServices } from "./auth.controller";

const router = Router();

// login with credential
router.post("/login", AuthServices.credentialLogin);

export const AuthRoutes = router;
