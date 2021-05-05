import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import User from "../models/User";

async function protect(req: Request, res: Response, next: NextFunction) {
  let token;
  if (req.cookies) token = req.cookies.jwt;
  if (!token)
    return res.status(401).json({
      error: "Unauthorized. Invalid token. Log in to access the page",
      data: null,
    });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // @ts-ignore
    const foundUser = await User.findById(decoded.id)
      .select("-email")
      .select("-__v");
    if (!foundUser)
      return res.status(404).json({
        error: "Unauthorized. Invalid token. Log in to access the page",
        data: null,
      });
    // @ts-ignore
    req.user = foundUser;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Unauthorized. Invalid token. Log in to access the page",
      data: null,
    });
  }
}

export default protect;
