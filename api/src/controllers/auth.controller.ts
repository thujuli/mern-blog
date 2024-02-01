import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import bcryptjs from "bcryptjs";
import errorHandler from "../utils/error";
import jwt from "jsonwebtoken";

const registerCreate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    next(error);
  }
};

const loginCreate = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw errorHandler(400, "Invalid Credentials");
    }

    const isValidUser = bcryptjs.compareSync(password, user.password);
    if (!isValidUser) {
      throw errorHandler(400, "Invalid Credentials");
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
    const { password: pass, ...rest } = user.toObject();

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export { registerCreate, loginCreate };
