import prisma from "../../../shared/prisma";
import AppError from "../../../shared/AppError";

type SendRequestPayload = {
  travelPlanId: number;
};

const sendRequest = async (userId: number, payload: SendRequestPayload) => {
  const travelPlanId = Number(payload.travelPlanId);
  console.log("travelPlanId:", travelPlanId, typeof travelPlanId);

  if (isNaN(travelPlanId)) {
    throw new AppError(400, "Invalid travelPlanId");
  }

  const travelPlan = await prisma.travelPlan.findUnique({
    where: { id: travelPlanId },
  });

  if (!travelPlan) {
    throw new AppError(404, "Travel plan not found");
  }

  // 3️⃣ Host
  const host = await prisma.host.findUnique({
    where: { id: travelPlan.hostId },
  });

  if (!host) {
    throw new AppError(404, "Host not found");
  }

  // 4️⃣ Already requested check (optional)
  const existingRequest = await prisma.tourRequest.findFirst({
    where: {
      requesterId: userId,
      travelPlanId,
    },
  });

  if (existingRequest) {
    throw new AppError(409, "You have already requested this travel plan");
  }

  // 5️⃣ Create Tour Request
  const tourRequest = await prisma.tourRequest.create({
    data: {
      requesterId: userId,
      travelPlanId: travelPlan.id,
      status: "PENDING",
    },
  });

  return tourRequest;
};

export const TourRequestService = {
  sendRequest,
};
