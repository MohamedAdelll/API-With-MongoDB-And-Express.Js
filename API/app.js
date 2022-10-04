import express from "express";
import userRouter from "./router/userRouter.js";
import postRouter from "./router/postRouter.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import https from "https";
import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import ExpressBrute from "express-brute";

const store = new ExpressBrute.MemoryStore();

const globalBruteforce = new ExpressBrute(store, {
  freeRetries: 1000,
  attachResetToRequest: false,
  refreshTimeoutOnRequest: false,
  minWait: 25 * 60 * 60 * 1000, // 1 day 1 hour (should never reach this wait time)
  maxWait: 25 * 60 * 60 * 1000, // 1 day 1 hour (should never reach this wait time)
  lifetime: 24 * 60 * 60, // 1 day (seconds not milliseconds)
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const app = express();
// app.use(globalBruteforce.prevent);
// app.use(morgan());
app.use(express.static(path.join(__dirname, "..", "FrontEnd", "public")));
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(express.json());

mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => console.log("DB connection successful!"))
  .catch((err) => console.log(err));

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(cors());

app.get("/home", (_, res) =>
  res.sendFile(path.join(__dirname, "..", "FrontEnd", "public", "home.html"))
);

app.get("/", (_, res) =>
  res.sendFile(path.join(__dirname, "..", "FrontEnd", "public", "signin.html"))
);

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
    console.log("server is runing at port 8080");
  });
