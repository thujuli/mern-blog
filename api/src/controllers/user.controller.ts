import { NextFunction, Request, Response } from "express";
import bcryptjs from "bcryptjs";
import createCustomError from "../utils/error";
import User from "../models/user.model";
import { UserRequest, UserFields } from "user.type";

const userUpdate = async (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.user.id !== req.params.userId) {
    return next(
      createCustomError(403, "You are not allowed to update this user")
    );
  }

  const { username, email, profilePicture, password }: UserRequest = req.body;
  const userFields: UserFields = {};
  if (profilePicture) {
    userFields.profilePicture = profilePicture;
  }

  if (email) {
    const userEmailExists = await User.findOne({ email });
    if (
      userEmailExists &&
      userEmailExists.email === email &&
      userEmailExists._id.toString() !== res.locals.user.id
    ) {
      return next(createCustomError(400, "Email already exists"));
    }

    userFields.email = email;
  }

  if (username) {
    const userUsernameExists = await User.findOne({ username });

    if (
      userUsernameExists &&
      userUsernameExists.username === username &&
      userUsernameExists._id.toString() !== res.locals.user.id
    ) {
      return next(createCustomError(400, "Username already exists"));
    }

    if (username.length < 5) {
      return next(
        createCustomError(400, "Username must be at least 5 characters")
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

    userFields.username = username;
  }

  if (password) {
    if (password.length < 6) {
      return next(
        createCustomError(400, "Password must be at least 6 characters")
      );
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
    res.json(rest);
  } catch (error) {
    if (error instanceof Error) {
      console.error("User update error:", error.message);
    }
    next(createCustomError(500, "Internal server error"));
  }
};

const userDestroy = async (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.user.id !== req.params.userId && !res.locals.user.isAdmin) {
    return next(
      createCustomError(403, "You are not allowed to delete this user")
    );
  }

  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: "User has been deleted" });
  } catch (error) {
    if (error instanceof Error) {
      console.error("User destroy error:", error.message);
    }
    next(createCustomError(500, "Internal server error"));
  }
};

const userIndex = async (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.user.isAdmin) {
    return next(
      createCustomError(403, "You are not allowed to access this page")
    );
  }

  try {
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 9;
    const sort = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sort })
      .skip(skip)
      .limit(limit);
    const usersWithoutPass = users.map((user) => {
      const { password, ...rest } = user.toObject();
      return rest;
    });

    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDay()
    );
    const totalLastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.json({ users: usersWithoutPass, totalUsers, totalLastMonthUsers });
  } catch (error) {
    if (error instanceof Error) {
      console.error("User index error", error.message);
    }
    next(createCustomError(500, "Internal server error"));
  }
};

const userShow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.userId);
    const { password, ...rest } = user.toObject();
    res.json(rest);
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      return next(createCustomError(404, "User not found"));
    } else {
      if (error instanceof Error) {
        console.error("User show error:", error.message);
      }
      return next(createCustomError(500, "Internal server error"));
    }
  }
};

export { userUpdate, userDestroy, userIndex, userShow };
