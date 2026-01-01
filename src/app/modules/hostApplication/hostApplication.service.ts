import prisma from "../../../shared/prisma";
import AppError from "../../../shared/AppError";
import httpStatus from "http-status";

const apply = async (userId: number) => {
  const alreadyApplied = await prisma.hostApplication.findFirst({
    where: { userId },
  });

  if (alreadyApplied) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Already applied for host"
    );
  }

  return prisma.hostApplication.create({
    data: {
      userId,
      status: "PENDING",
    },
  });
};

export const HostApplicationService = {
  apply,
};
