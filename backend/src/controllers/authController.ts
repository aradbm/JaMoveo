import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import { decryptPassword } from "../utils/encryption";

export const signup = async (req: Request, res: Response) => {
  console.log("User signup");
  try {
    const {
      username,
      encryptedPassword,
      instrument,
      isAdmin = false,
    } = req.body;

    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const password = decryptPassword(encryptedPassword);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      instrument,
      isAdmin,
    });

    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error in signup", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, encryptedPassword } = req.body;
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const password = decryptPassword(encryptedPassword);
    console.log("pw: ", password);

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("returning user: ", user);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error in login", error });
  }
};
