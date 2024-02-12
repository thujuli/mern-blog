import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import createCustomError from "../utils/error";

interface DecodedJwt {
  id: string;
  iat: number;
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies;

  if (!token) {
    return next(createCustomError(401, "Unauthorized"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as DecodedJwt;
    res.locals.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export { verifyToken };
