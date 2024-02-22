import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import bcryptjs from "bcryptjs";
import createCustomError from "../utils/error";
import jwt from "jsonwebtoken";
import { AuthGoogle, AuthLogin, AuthRegistration } from "auth.type";

const registration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password }: AuthRegistration = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(createCustomError(400, "All fields are required"));
  }

  const userUsernameExists = await User.findOne({ username });
  if (userUsernameExists) {
    return next(createCustomError(400, "Username already exists"));
  }

  const userEmailExists = await User.findOne({ email });
  if (userEmailExists) {
    return next(createCustomError(400, "Email already exists"));
  }

  if (username.length < 5) {
    return next(
      createCustomError(400, "Username must be at least 5 characters")
    );
  }
  if (password.length < 6) {
    return next(
      createCustomError(400, "Password must be at least 6 characters")
    );
  }
  if (username.includes(" ")) {
    return next(createCustomError(400, "Username cannot contain spaces"));
  }
  if (username !== username.toLocaleLowerCase()) {
    return next(createCustomError(400, "Username must be lowercase"));
  }
  if (!username.match(/^[A-Za-z0-9]*$/)) {
    return next(
      createCustomError(400, "Username can only contain letters and numbers")
    );
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Registration error:", error);
    next(createCustomError(500, "Internal server error"));
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password }: AuthLogin = req.body;

  if (!email || !password || email === "" || password === "") {
    return next(createCustomError(400, "All fields are required"));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw createCustomError(400, "Invalid Credentials");
    }

    const isValidUser = bcryptjs.compareSync(password, user.password);
    if (!isValidUser) {
      throw createCustomError(400, "Invalid Credentials");
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET_KEY
    );
    const { password: pass, ...rest } = user.toObject();

    res.cookie("token", token, { httpOnly: true }).json(rest);
  } catch (error) {
    if (error.statusCode === 400) {
      next(error);
    } else {
      console.error("Login error:", error);
      next(createCustomError(500, "Internal server error"));
    }
  }
};

const google = async (req: Request, res: Response, next: NextFunction) => {
  const { displayName, email, photoURL }: AuthGoogle = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET_KEY
      );
      const { password, ...rest } = user.toObject();

      res
        .cookie("token", token, {
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

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);
      const { password: pass, ...rest } = newUser.toObject();

      res
        .status(201)
        .cookie("token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    console.error("Google registration error:", error);
    next(createCustomError(500, "Internal server error"));
  }
};

const logout = (req: Request, res: Response) => {
  res.clearCookie("token").json({ message: "User has successfully logout" });
};

export { google, login, logout, registration };
