import AppError from "../../../shared/AppError";
import prisma from "../../../shared/prisma";

const approveHost = async (applicationId: number) => {
  const application = await prisma.hostApplication.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    throw new AppError(404, "Application not found");
  }

  // create host profile
  await prisma.host.create({
    data: {
      userId: application.userId,
    },
  });

  // update user role
  await prisma.user.update({
    where: { id: application.userId },
    data: {
      role: "BOTH",
    },
  });

  return prisma.hostApplication.update({
    where: { id: applicationId },
    data: { status: "APPROVED" },
  });
};
export const AdminService = {
  approveHost,
};