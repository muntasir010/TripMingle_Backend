import config from "../../../config";
import bcrypt from "bcryptjs";
import prisma from "../../../shared/prisma";
import AppError from "../../../shared/AppError";
import { jwtHelper } from "../../helper/jwtHelper";

type LoginPayload = {
  email: string;
  password: string;
};

const loginUser = async (payload: LoginPayload) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new AppError(401, "Invalid credentials");
  }

 const accessToken = jwtHelper.generateToken(
  {
    userId: user.id,
    role: user.role,
    email: user.email,
  },
  config.jwt_access_secret,
  config.jwt_access_expires_in
);

const refreshToken = jwtHelper.generateToken(
  {
    userId: user.id,
  },
  config.jwt_refresh_secret,
  config.jwt_refresh_expires_in
);


  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const switchActiveRole = async (
  userId: number,
  role: "TOURIST" | "HOST"
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { host: true },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (role === "HOST" && !user.host) {
    throw new AppError(403, "You are not registered as a Host");
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      role: role,
    },
  });
};

const changePassword = async (userId: number, payload: any) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  const isMatch = await bcrypt.compare(
    payload.oldPassword,
    user!.password
  );

  if (!isMatch) {
    throw new AppError(401, "Old password incorrect");
  }

  const newPassword = await bcrypt.hash(payload.newPassword, 12);

  return prisma.user.update({
    where: { id: userId },
    data: {
      password: newPassword,
      needPasswordChange: false,
    },
  });
};



export const AuthService = {
  loginUser,
  switchActiveRole,
  changePassword,
};
