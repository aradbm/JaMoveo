import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, password, instrument, isAdmin = false } = req.body;

    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      instrument,
      isAdmin,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error in signup", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
        instrument: user.instrument,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error in login", error });
  }
};
