import { NextFunction, Request, Response } from "express";
import bcryptjs from "bcryptjs";
import errorHandler from "../utils/error";
import User from "../models/user.model";

const userUpdate = async (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.user !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }

  const { username, email, profilePicture } = req.body;
  let { password } = req.body;

  if (username) {
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
  }

  if (password) {
    if (password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }
    password = bcryptjs.hashSync(password, 10);
  }

  try {
    const userUpdate = await User.findByIdAndUpdate(
      req.params.userId,
      { username, email, password, profilePicture },
      { new: true }
    );

    const { password: pass, ...rest } = userUpdate.toObject();
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export { userUpdate };
