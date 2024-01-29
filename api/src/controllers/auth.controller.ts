import { Request, Response } from "express";
import User from "../models/user.model";
import bcryptjs from "bcryptjs";

const registerCreate = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    res.status(400).json({ message: "All fields are required" });
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { registerCreate };
