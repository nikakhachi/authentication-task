import { Response, Request } from "express";
const express = require("express");
const router = express.Router();
import IUserRegister from "../../interfaces/userRegister";
import IUserLogin from "../../interfaces/userLogin";

import User from "../../models/User";

import { sendMessage } from "../../utils/socket-io";

function addCookie(res: Response, token: string) {
  res.cookie("jwt", token, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });
}

// @Route - POST /api/auth/register
// @Access - Public
// @Function - Registers the user
router.post("/register", async (req: Request, res: Response) => {
  const body: IUserRegister = req.body;
  const { username, password, confirmPassword } = body;

  // Front will be checking for the fields. This is for EXTRA PROTECTION
  if (!username || !password || !confirmPassword)
    return res
      .status(400)
      .json({ error: "Please fill all fields", data: null });

  // Front will be checking if password match. This is for EXTRA PROTECTION
  if (password !== confirmPassword)
    return res
      .status(400)
      .json({ error: "Passwords do not match", data: null });

  try {
    // System will check if username exists
    const foundUser = await User.findOne({ username });
    if (foundUser)
      return res.status(400).json({ error: "Username is taken", data: null });

    // Triming unnecessary spaces and lowering all cases
    const modifiedUsername = username.trim().toLowerCase();

    // Saving user to database
    const newUser = new User({ username: modifiedUsername, password });
    const savedUser = await newUser.save();

    // Generating Token and inserting into cookies
    const token = await savedUser.generateToken();
    addCookie(res, token);

    const userCount = await User.countDocuments();
    if (userCount === 4) sendMessage("message", "You’re lucky person :)");

    res.status(201).json({
      error: null,
      data: {
        msg: "User created successfully",
        token,
        user: savedUser.username,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message, data: null });
  }
});

// @Route - POST /api/auth/login
// @Access - Public
// @Function - Authenticates the user
router.post("/login", async (req: Request, res: Response) => {
  const body: IUserLogin = req.body;
  const { username, password } = body;

  // Front will be checking for the fields. This is for EXTRA PROTECTION
  if (!username || !password)
    return res
      .status(400)
      .json({ error: "Please fill all fields", data: null });

  try {
    // Search user by provided suername in the base, if no users found, error will be returned
    const foundUser = await User.findOne({ username }).select("+password");
    if (!foundUser)
      return res.status(404).json({ error: "User doesn't exist", data: null });

    // If password isn't valid error will be returned
    const isMatch = await foundUser.comparePasswords(password);
    if (!isMatch)
      return res.status(400).json({ error: "Incorrect Password", data: null });

    // Generating Token and inserting into cookies
    const token = await foundUser.generateToken();
    addCookie(res, token);

    res.status(200).json({
      error: null,
      data: {
        msg: "Logged in Successfully",
        token,
        user: foundUser.username,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message, data: null });
  }
});

// @Route - POST /api/auth/logout
// @Access - Public
// @Function - Removes jwt cookie
router.post("/logout", (req: Request, res: Response) => {
  addCookie(res, "Expired Token");
  res.status(200).json({ msg: "Logged out successfuly" });
});

export default router;
