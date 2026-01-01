import { Request, Response, NextFunction } from "express";
import { jwtHelper } from "../helper/jwtHelper";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../shared/AppError";
import httpStatus from "http-status";

const auth = (...roles: string[]) => {
  return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken;
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }

      const verifyUser = jwtHelper.verifyToken(
        token,
        config.jwt_access_secret
      ) as JwtPayload;

      req.user = verifyUser;

      if (roles.length && !roles.includes(verifyUser.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "Forbidden access");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;