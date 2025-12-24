import { Request } from "express";
import bcrypt from "bcryptjs";
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../helper/fileUploader";
import AppError from "../../../shared/AppError";

const createTourist = async (req: Request) => {
  const { tourist } = req.body;

  const isUserExists = await prisma.user.findUnique({
    where: { email: tourist.email },
  });

  if (isUserExists) {
    throw new AppError(400, "Email already registered");
  }

  if (req.file) {
    const uploadResult = await fileUploader.uploadCloudinary(req.file);
    req.body.tourist.profilePhoto = uploadResult?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const result = await prisma.$transaction(async (tnx) => {
    // 1. create user
    const user = await tnx.user.create({
      data: {
        name: req.body.tourist.name,
        email: req.body.tourist.email,
        password: hashedPassword,
        role: "TOURIST",
        profilePhoto: req.body.tourist.profilePhoto,
      },
    });

    // 2. create tourist (ONLY schema fields)
    const tourist = await tnx.tourist.create({
      data: {
        userId: user.id,
        phone: req.body.tourist?.phone ?? null,
        country: req.body.tourist?.country ?? null,
        bio: req.body.tourist?.bio ?? null,
      },
    });

    return { user, tourist };
  });

  return result;
};

// const createTourist = async (req: Request) => {
//   const { tourist, password } = req.body;

//   // 1️⃣ email duplicate check
//   const isUserExists = await prisma.user.findUnique({
//     where: { email: tourist.email },
//   });

//   if (isUserExists) {
//     throw new AppError(400, "Email already registered");
//   }

//   // 2️⃣ file upload (optional)
//   if (req.file) {
//     const uploadResult = await fileUploader.uploadCloudinary(req.file);
//     tourist.profilePhoto = uploadResult?.secure_url;
//   }

//   // 3️⃣ password hash
//   const hashedPassword = await bcrypt.hash(password, 12);

//   // 4️⃣ transaction
//   const result = await prisma.$transaction(async (tnx) => {
//     // create user
//     const user = await tnx.user.create({
//       data: {
//         name: tourist.name,
//         email: tourist.email,
//         password: hashedPassword,
//         role: "TOURIST",
//         profilePhoto: tourist.profilePhoto ?? null,
//         status: "ACTIVE",
//       },
//     });

//     // create tourist profile
//     const touristProfile = await tnx.tourist.create({
//       data: {
//         userId: user.id,
//         phone: tourist.phone ?? null,
//         country: tourist.country ?? null,
//         bio: tourist.bio ?? null,
//       },
//     });

//     return {
//       user,
//       tourist: touristProfile,
//     };
//   });

//   return result;
// };

export const UserService = {
  createTourist,
};
