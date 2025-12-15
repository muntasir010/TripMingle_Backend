import { Request, Response, NextFunction } from "express";
import AppError from "../../shared/AppError";

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong";

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: error instanceof AppError ? undefined : error,
  });
};

export default globalErrorHandler;
