import { Request, Response, NextFunction } from "express";
import { jwtHelper } from "../helper/jwtHelper";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../shared/AppError";
import httpStatus from "http-status";

// const auth = (...roles: string[]) => {
//   return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
//     try {
//       const token = req.cookies.accessToken;
//       if (!token) {
//         throw new AppError( httpStatus.UNAUTHORIZED , "You are not authorized" );
//       }

//       const verifyUser = jwtHelper.verifyToken(
//         token,
//         config.jwt_access_secret
//       ) as JwtPayload;
//       req.user = verifyUser;
//       if(verifyUser && roles.length && !roles.includes(verifyUser.role)) {
//          throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
//       }
//       next();

//     } catch (error) {
//       next(error);
//     }
//   };
// };


// export default auth;

// import { Request, Response, NextFunction } from "express";
// import { jwtHelper } from "../helper/jwtHelper";
// import config from "../../config";
// import { JwtPayload } from "jsonwebtoken";
// import AppError from "../../shared/AppError";
// import httpStatus from "http-status";

// interface AuthUser {
//   id: number;
//   email: string;
//   role: string;
// }

// const auth = (...roles: string[]) => {
//   return async (req: Request & { user?: AuthUser }, res: Response, next: NextFunction) => {
//     try {
//       const token = req.cookies.accessToken;
//       if (!token) {
//         throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
//       }

//       const verifyUser = jwtHelper.verifyToken(
//         token,
//         config.jwt_access_secret
//       ) as JwtPayload & AuthUser;

//       req.user = verifyUser;

//       if (roles.length && !roles.includes(verifyUser.role)) {
//         throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
//       }

//       next();
//     } catch (error) {
//       next(error);
//     }
//   };
// };

// export default auth;

const auth = (...roles: string[]) => {
  return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken; // নিশ্চিত হোন cookie-parser ব্যবহার করছেন
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }

      const verifyUser = jwtHelper.verifyToken(
        token,
        config.jwt_access_secret
      ) as JwtPayload;

      // টোকেন থেকে পাওয়া ডেটা req.user এ সেট করা হচ্ছে
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