import express from "express";
import userRouter from "./router/userRouter.js";
import postRouter from "./router/postRouter.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import https from "https";
import fs from "fs";

dotenv.config();
const app = express();

app.use(helmet());

mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => console.log("DB connection successful!"))
  .catch((err) => console.log(err));

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("*", (req, res) =>
  res.status(404).json({
    status: "fail",
    message: `No route matches ${req.get("host") + req.originalUrl}`,
  })
);
app.use((err, _req, res, _) => {
  const statusCode = parseInt(err.message.slice(-3)) || 500;
  const statusMessage = `${statusCode}`.startsWith("5") ? "error" : "fail";
  err.message = `${statusCode}`.startsWith("5")
    ? err.message
    : err.message.slice(0, -3);
  res.status(statusCode).json({ status: statusMessage, message: err.message });
});
const port = 8080;

https
  .createServer(
    {
      key: fs.readFileSync("./key.pem"),
      cert: fs.readFileSync("./cert.pem"),
    },
    app
  )
  .listen(port, () => {
    console.log("server is runing at port 4000");
  });
