import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import errorHandler from "../utils/error";

interface DecodedJwt {
  id: string;
  iat: number;
}

const userVerificationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as DecodedJwt;
    res.locals.user = decoded.id;
    next();
  } catch (error) {
    next(error);
  }
};

export default userVerificationMiddleware;
