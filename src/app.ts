import express, { type Request, type Response } from "express";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandlers";
import notFound from "./app/middlewares/notFound";
import { router } from "./app/routes";
import expressSession from "express-session";
import { envVars } from "./app/config/env";
import passport from "passport";
import cookieParser from "cookie-parser";
import cors from 'cors'
import "./app/config/passport";

const app = express();

app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
  })
);
app.use("/api/v1", router);
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "welcome to the server" });
});
app.use(globalErrorHandler);
app.use(notFound);
export default app;
