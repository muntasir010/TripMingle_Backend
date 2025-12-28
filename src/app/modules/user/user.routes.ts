import express, { Request, Response, NextFunction } from "express";
import { UserController } from "./user.controllers";
import { fileUploader } from "../../helper/fileUploader";
import { UserValidation } from "./user.validation";
import AppError from "../../../shared/AppError";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/", auth(UserRole.ADMIN), UserController.getAllFromDB);

router.post(
  "/create-admin", auth( UserRole.ADMIN),
  fileUploader.upload.single("file"),
  UserController.createAdmin
);
router.post(
  "/create-host", auth( UserRole.ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  UserController.createHost
);

router.post(
  "/create-tourist",
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

export const UserRoutes = router;
