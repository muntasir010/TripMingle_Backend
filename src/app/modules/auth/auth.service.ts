import config from "../../../config";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import bcrypt from "bcryptjs";
import prisma from "../../../shared/prisma";

type LoginPayload = {
  email: string;
  password: string;
};

const loginUser = async (payload: LoginPayload) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid credentials");
  }

  const jwtSecret: Secret = config.jwt_secret as string;

  const jwtOptions: SignOptions = {
    expiresIn: config.jwt_expires_in as StringValue,
  };

  const accessToken = jwt.sign(
    {
      userId: user.id,
      role: user.role,
      email: user.email,
    },
    jwtSecret,
    jwtOptions
  );

  return {
    accessToken,
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
