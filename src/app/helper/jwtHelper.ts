import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export const generateToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: SignOptions["expiresIn"]
) => {
  return jwt.sign(payload, secret, { expiresIn });
};
