// @ts-ignore
import prisma from "../../../shared/prisma";
import AppError from "../../../shared/AppError";
import { sslcommerz } from "../../../config/sslcommerz";

const initiatePayment = async (
  userId: number,
  travelPlanId: number,
  seats: number,
) => {
  const plan = await prisma.travelPlan.findUnique({
    where: { id: travelPlanId },
  });

  if (!plan) throw new AppError(404, "Trip not found");

  if (plan.totalCapacity < seats) {
    throw new AppError(400, "Not enough seats");
  }

  const pricePerSeat = Math.floor(plan.budget / plan.capacity);
  const amount = pricePerSeat * seats;

  const payment = await prisma.payment.create({
    data: {
      userId,
      travelPlanId,
      seats,
      amount,
      status: "PENDING",
    },
  });

  const data = {
    total_amount: amount,
    currency: "BDT",
    tran_id: payment.id,
    success_url: `${process.env.CLIENT_URL}/payment/success?pid=${payment.id}`,
    fail_url: `${process.env.CLIENT_URL}/payment/fail`,
    cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
    product_name: plan.title,
    product_category: "Travel",
    product_profile: "general",
    cus_name: "Tourist",
    cus_email: "tourist@email.com",
  };

  const response = await sslcommerz.init(data);

  return response.GatewayPageURL;
};

const confirmPayment = async (paymentId: string) => {
  return await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment || payment.status === "PAID") {
      throw new AppError(400, "Invalid payment");
    }

    // 1️⃣ update payment
    await tx.payment.update({
      where: { id: paymentId },
      data: { status: "PAID" },
    });

    // 2️⃣ confirm travel request
    await tx.travelRequest.updateMany({
      where: {
        requesterId: payment.userId,
        travelPlanId: payment.travelPlanId,
        status: "PENDING",
      },
      data: {
        status: "CONFIRMED",
        paymentId: payment.id,
      },
    });

    // 3️⃣ update seat count
    await tx.travelPlan.update({
      where: { id: payment.travelPlanId },
      data: {
        totalCapacity: { decrement: payment.seats },
        joinedCount: { increment: payment.seats },
      },
    });

    return { success: true };
  });
};

const cancelBooking = async (userId: number, planId: number) => {
  const plan = await prisma.travelPlan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    throw new AppError(404, "Travel plan not found");
  }

  const request = await prisma.travelRequest.findFirst({
    where: {
      requesterId: userId,
      travelPlanId: planId,
      status: "CONFIRMED",
    },
  });

  if (!request) {
    throw new AppError(400, "No confirmed booking found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.travelRequest.update({
      where: { id: request.id },
      data: { status: "CANCELLED" },
    });

    await tx.travelPlan.update({
      where: { id: planId },
      data: {
        joinedCount: {
          decrement: request.seats,
        },
      },
    });
  });
};

const getAllPayments = async () => {
  return prisma.payment.findMany({
    include: {
      travelPlan: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const PaymentService = {
  initiatePayment,
  confirmPayment,
  cancelBooking,
  getAllPayments,
};
