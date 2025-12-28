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

const getPublicProfile = async (userId: number) => {
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          role: true,
          profilePhoto: true,
          isPremium: true,
        },
      },
    },
  });

  if (!profile) {
    throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
  }

  return {
    userId: profile.user.id,
    name: profile.user.name,
    role: profile.user.role,
    profilePhoto: profile.user.profilePhoto,
    isPremium: profile.user.isPremium,
    bio: profile.bio,
    interests: profile.interests,
    visitedCountries: profile.visitedCountries,
    location: profile.location,
    social: {
      facebook: profile.facebook,
      instagram: profile.instagram,
    },
  };
};

export const ProfileService = {
  createProfile,
  getPublicProfile,
};
