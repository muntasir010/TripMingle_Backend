import prisma from '../shared/prisma';

export const connect = async () => {
  try {
    await prisma.$connect();
    console.log('Prisma connected');
  } catch (err) {
    console.error('Prisma connect error', err);
    throw err;
  }
};
