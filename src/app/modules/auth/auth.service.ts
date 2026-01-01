import config from "../../../config";
import bcrypt from "bcryptjs";
import prisma from "../../../shared/prisma";
import AppError from "../../../shared/AppError";
import { jwtHelper } from "../../helper/jwtHelper";
import crypto from "crypto";
import sendEmail from "../../../shared/sendEmail";

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

const switchActiveRole = async (userId: number, role: "TOURIST" | "HOST") => {
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

  const isMatch = await bcrypt.compare(payload.oldPassword, user!.password);

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

const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  // generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: hashedToken,
      passwordResetExpires: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "Reset your password",
    html: `
      <p>You requested a password reset.</p>
      <p>Click below to reset password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire in 10 minutes.</p>
    `,
  });

  return {
    message: "Password reset link sent to email",
  };
};

const resetPassword = async (token: string, newPassword: string) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new AppError(400, "Token is invalid or expired");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
      needPasswordChange: false,
    },
  });

  return {
    message: "Password reset successful",
  };
};

export const AuthService = {
  loginUser,
  switchActiveRole,
  changePassword,
  forgotPassword,
  resetPassword,
};
