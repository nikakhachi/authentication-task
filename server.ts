import express, { Response, Request } from "express";
import authRouter from "./routes/auth/auth";
import privateRouter from "./routes/private/private";
import mongoose from "mongoose";
import middleware from "./middleware/protect";
import cookieParser from "cookie-parser";
import session from "express-session";
import path from "path";

require("dotenv").config({ path: "./config.env" });

const app = express();

app.use(express.json());
app.use(cookieParser());

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
  { useUnifiedTopology: true, useCreateIndex: true, useNewUrlParser: true },
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
}

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
