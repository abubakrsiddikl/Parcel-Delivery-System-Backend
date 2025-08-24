import mongoose from "mongoose";
import { Server } from "http";
import app from "./app";


let server: Server;
const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://abubakr:Limon6699@cluster0.lfjkv.mongodb.net/tour-management?retryWrites=true&w=majority&appName=Cluster0"
    );

    console.log("✅ Connected to DB!!");

    server = app.listen(5000, () => {
      console.log(`✅ Server is listening to `);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
