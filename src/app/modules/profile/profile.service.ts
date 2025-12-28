import httpStatus from 'http-status';
import AppError from "../../../shared/AppError";
import prisma from "../../../shared/prisma";

const createProfile = async (userId: number, payload: any) => {
  const isExist = await prisma.userProfile.findUnique({
    where: { userId },
  });

  if (isExist) {
    throw new AppError(400, "Profile already exists");
  }

  const profile = await prisma.userProfile.create({
    data: {
      userId,
      bio: payload.bio,
      interests: payload.interests,
      visitedCountries: payload.visitedCountries,
      location: payload.location,
      facebook: payload.facebook,
      instagram: payload.instagram,
    },
  });

  return profile;
};



export const ProfileService = {
  createProfile,
};
