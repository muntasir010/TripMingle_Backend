export type TripStatus = 'UPCOMING' | 'RUNNING' | 'COMPLETED';

export const getTripStatus = (
  startDate: Date,
  endDate: Date
): TripStatus => {
  const now = new Date();

  if (now < startDate) return 'UPCOMING';
  if (now >= startDate && now <= endDate) return 'RUNNING';
  return 'COMPLETED';
};
