import { prisma } from "../../../shared/prisma";

interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
}

const createUser = async (payload: CreateUserPayload) => {
  const exist = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (exist) {
    throw new Error("User already exists");
  }

  const result = await prisma.user.create({
    data: payload,
  });

  return result;
};

export const UserServices = {
  createUser,
};
