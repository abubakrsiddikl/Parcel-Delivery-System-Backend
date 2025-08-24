import express, { type Request, type Response } from "express";

const app = express();

app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "welcome to the server" });
});
export default app;
