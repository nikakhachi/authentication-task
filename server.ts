import { Response, Request } from "express";
const express = require("express");
import authRouter from "./routes/auth/auth";
import privateRouter from "./routes/private/private";
const mongoose = require("mongoose");
import middleware from "./middleware/protect";
const cookieParser = require("cookie-parser");
const session = require("express-session");
import * as path from "path";
import * as http from "http";
import { socketConnection } from "./utils/socket-io";

require("dotenv").config({ path: "./config.env" });

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());

socketConnection(server);

const sessionConfig = {
  secret: process.env.SESSION_SECRET!,
  name: process.env.SESSION_NAME!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: false,
    secure: true,
  },
};

app.use(session(sessionConfig));

mongoose.connect(
  process.env.MONGO_URI!,
  {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  },
  () => console.log("MongoDB Connected")
);

app.use("/api/auth", authRouter);
app.use("/api/private", middleware, privateRouter);

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
  sessionConfig.cookie.secure = true;
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req: Request, res: Response) => {
    res.send("DEVELOPMENT ENVIRONMENT");
  });
}

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
