import { Prisma } from "@prisma/client";

type QueryParams = {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export const buildPrismaQuery = (
  searchableFields: string[],
  params: QueryParams
) => {
  const {
    search,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const skip = (page - 1) * limit;

  let where: Prisma.HostApplicationWhereInput = {};

  if (search) {
    where.OR = searchableFields.map(field => ({
      [field.split(".")[0]]: {
        [field.split(".")[1]]: {
          contains: search,
          mode: "insensitive",
        },
      },
    }));
  }

  return {
    where,
    skip,
    take: Number(limit),
    orderBy: {
      [sortBy]: sortOrder,
    },
  };
};
