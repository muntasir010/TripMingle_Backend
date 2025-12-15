// import { Request, Response, NextFunction } from "express";

// const catchAsync =
//   (fn: any) =>
//   (req: Request, res: Response, next: NextFunction) =>
//     Promise.resolve(fn(req, res, next)).catch(next);

// export default catchAsync;

import { Request, Response, NextFunction } from "express";

const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default catchAsync;
