import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const generateToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: SignOptions["expiresIn"]
) => {
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token: string, secret: string): JwtPayload | string => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelper = {
  generateToken,
  verifyToken,
};