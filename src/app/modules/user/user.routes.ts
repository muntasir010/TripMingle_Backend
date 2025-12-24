import express, { Request, Response, NextFunction } from "express";
import { UserController } from "./user.controllers";
import { fileUploader } from "../../helper/fileUploader";
import { UserValidation } from "./user.validation";
import AppError from "../../../shared/AppError";

const router = express.Router();

router.post(
  "/register",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.body?.data) {
      throw new AppError(400, "Invalid request body");
    }

    const parsedData = JSON.parse(req.body.data);

    req.body = UserValidation.createTouristValidationSchema.parse(parsedData);

    return UserController.createTourist(req, res, next);
  }
);

// router.post(
//   "/register",
//   fileUploader.upload.single("file"),
//   (req, res, next) => {
//     // console.log("req.file:", req.file);
//     UserController.createTourist(req, res, next);
//   }
// );

export const UserRoutes = router;
