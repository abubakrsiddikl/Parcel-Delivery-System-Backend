import express, { type Request, type Response } from "express";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandlers";
import notFound from "./app/middlewares/notFound";
import { router } from "./app/routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router);
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "welcome to the server" });
});
app.use(globalErrorHandler);
app.use(notFound);
export default app;
