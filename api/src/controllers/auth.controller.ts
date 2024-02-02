import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import bcryptjs from "bcryptjs";
import errorHandler from "../utils/error";
import jwt from "jsonwebtoken";
import { IAuthGoogle, IAuthLogin, IAuthRegistration } from "auth.type";

const registrationStore = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password }: IAuthRegistration = req.body;

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

const loginStore = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password }: IAuthLogin = req.body;

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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
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

const googleStore = async (req: Request, res: Response, next: NextFunction) => {
  const { displayName, email, photoURL }: IAuthGoogle = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
      const { password, ...rest } = user.toObject();

      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const username =
        displayName.split(" ").join("").toLowerCase() +
        Math.random().toString().slice(-4);
      const password = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(password, 10);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        profilePicture: photoURL,
      });
      await newUser.save();

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
      const { password: pass, ...rest } = user.toObject();

      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export { registrationStore, loginStore, googleStore };
