import { Request, Response, NextFunction } from "express";
import AppError from "../../shared/AppError";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: {
      ...(process.env.NODE_ENV === "development" && {
        stack: err.stack,
      }),
    },
  });
};

export default globalErrorHandler;
