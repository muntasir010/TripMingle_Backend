import bcrypt from "bcryptjs";
import prisma from "../../../shared/prisma";
import AppError from "../../../shared/AppError";

type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
};

const createUser = async (payload: CreateUserPayload) => {

  const isExist = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (isExist) {
    throw new AppError(409, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: "TOURIST",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return user;
};

export const UserService = {
  createUser,
};
