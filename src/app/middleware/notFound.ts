import { Request, Response, NextFunction } from "express";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    error: {
      path: req.originalUrl,
      method: req.method,
    },
  });
};

export default notFound;
