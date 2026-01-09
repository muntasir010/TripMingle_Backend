import { UserRole } from "@prisma/client";
import prisma from "../../../shared/prisma";

const getAdminStats = async () => {
  const totalUsers = await prisma.user.count();
  const totalTrips = await prisma.trip.count();
  const totalReviews = await prisma.review.count();
  const totalTravelPlans = await prisma.travelPlan.count();
  const totalTravelRequests = await prisma.travelRequest.count();

  return {
    totalUsers,
    totalTrips,
    totalReviews,
    totalTravelPlans,
    totalTravelRequests,
  };
};

const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profilePhoto: true,
    },
  });
};

const changeUserRole = async (id: number, role: UserRole) => {
  const isUserExist = await prisma.user.findUnique({
    where: { id },
  });

  if (!isUserExist) {
    throw new Error("User not found!");
  }

  const result = await prisma.user.update({
    where: { id },
    data: { role },
  });

  return result;
};

export const AdminService = {
  getAllUsers,
  changeUserRole,
  getAdminStats,
};
