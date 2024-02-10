import { NextFunction, Request, Response } from "express";
import bcryptjs from "bcryptjs";
import errorHandler from "../utils/error";
import User from "../models/user.model";
import { UserRequest, UserFields } from "user.type";

const userUpdate = async (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }

  const { username, email, profilePicture, password }: UserRequest = req.body;
  const userFields: UserFields = {};
  if (profilePicture) {
    userFields.profilePicture = profilePicture;
  }

  if (email) {
    const userUsernameExists = await User.findOne({ username });
    const userEmailExists = await User.findOne({ email });
    if (
      userEmailExists.email &&
      userUsernameExists._id.toString() !== res.locals.user.id
    ) {
      return next(errorHandler(400, "Email already exists"));
    }

    userFields.email = email;
  }

  if (username) {
    const userUsernameExists = await User.findOne({ username });
    if (
      userUsernameExists.username &&
      userUsernameExists._id.toString() !== res.locals.user.id
    ) {
      return next(errorHandler(400, "Username already exists"));
    }

    if (username.length < 5) {
      return next(errorHandler(400, "Username must be at least 5 characters"));
    }
    if (username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }
    if (username !== username.toLocaleLowerCase()) {
      return next(errorHandler(400, "Username must be lowercase"));
    }
    if (!username.match(/^[A-Za-z0-9]*$/)) {
      return next(
        errorHandler(400, "Username can only contain letters and numbers")
      );
    }

    userFields.username = username;
  }

  if (password) {
    if (password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }

    userFields.password = bcryptjs.hashSync(password, 10);
  }

  try {
    const userUpdate = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: userFields },
      { new: true }
    );
    const { password: pass, ...rest } = userUpdate.toObject();
    res.status(200).json(rest);
  } catch (error) {
    console.error("User update error:", error);
    next(errorHandler(500, "Internal server error"));
  }
};

const userDestroy = async (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }

  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: "User has been deleted" });
  } catch (error) {
    console.error("User destroy error:", error);
    next(errorHandler(500, "Internal server error"));
  }
};

export { userUpdate, userDestroy };
