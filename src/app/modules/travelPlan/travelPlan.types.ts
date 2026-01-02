import { TravelType } from "@prisma/client";

export type CreateTravelPlanPayload = {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelType: TravelType;
  description?: string;
  capacity: number;
};
export type SearchQuery = {
  destination?: string;
  startDate?: string;
  endDate?: string;
  interests?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};