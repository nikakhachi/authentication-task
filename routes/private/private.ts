import { Response, Request } from "express";
const express = require("express");
const router = express.Router();
import User from "../../models/User";

// @Route - GET /api/private
// @Access - Private
// @Function - Sends private data to the autheticated user
router.get("/", async (req: Request, res: Response) => {
  // @ts-ignore
  const { username } = req.user;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { $inc: { loginCount: 1 } },
      { new: true }
    );
    const count = await User.countDocuments();
    res.json({ error: null, data: { user: updatedUser, userCount: count } });
  } catch (error) {
    console.log(error);
  }
});

export default router;
