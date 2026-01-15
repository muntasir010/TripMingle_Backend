import { TravelType } from "@prisma/client";

export type CreateTravelPlanPayload = {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  photoURL: string;
  travelType: TravelType;
  description?: string;
  capacity: number;
  totalCapacity: number;
  joinedCount: number;
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
