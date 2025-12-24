// import jwtPayload  from 'jsonwebtoken';
import config from "../../../config";
import bcrypt from "bcryptjs";
import prisma from "../../../shared/prisma";
import AppError from "../../../shared/AppError";
import { generateToken } from "../../helper/jwtHelper";

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

 const accessToken = generateToken(
  {
    userId: user.id,
    role: user.role,
    email: user.email,
  },
  config.jwt_access_secret,
  config.jwt_access_expires_in
);

const refreshToken = generateToken(
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

export const AuthService = {
  loginUser,
};
