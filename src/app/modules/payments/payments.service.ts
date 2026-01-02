// @ts-ignore
import SSLCommerzPayment from "sslcommerz-lts";
import prisma from "../../../shared/prisma";
import config from "../../../config";

const store_id = config.ssl_store_id;
const store_passwd = config.ssl_store_pass;
const is_live = false;

const initSubscriptionPayment = async (
  userId: number,
  planId: number
) => {
  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    throw new Error("Invalid plan");
  }

  const transactionId = `TXN-${Date.now()}`;

  await prisma.payment.create({
    data: {
      userId,
      amount: plan.price,
      transactionId,
      status: "PENDING",
      planId,
    },
  });

  const data = {
    total_amount: plan.price,
    currency: "BDT",
    tran_id: transactionId,
    success_url: `${config.backend_url}/api/v1/payment/success`,
    fail_url: `${config.backend_url}/api/v1/payment/fail`,
    cancel_url: `${config.backend_url}/api/v1/payment/cancel`,
    product_name: "Premium Subscription",
    product_category: "Subscription",
    cus_name: "User",
    cus_email: "user@email.com",
    cus_add1: "Bangladesh",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const apiResponse = await sslcz.init(data);

  return apiResponse.GatewayPageURL;
};

const paymentSuccess = async (tranId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { transactionId: tranId },
    include: { user: true, },
  });

  if (!payment) return;

  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: payment.planId! },
  });

  const premiumUntil = new Date();
  premiumUntil.setDate(premiumUntil.getDate() + plan!.duration);

  await prisma.$transaction([
    prisma.payment.update({
      where: { transactionId: tranId },
      data: { status: "SUCCESS" },
    }),
    prisma.user.update({
      where: { id: payment.userId },
      data: {
        isPremium: true,
        premiumUntil,
        verifiedBadge: true,
      },
    }),
  ]);
};

const paymentFail = async (tranId: string) => {
  await prisma.payment.update({
    where: { transactionId: tranId },
    data: { status: "FAILED" },
  });
};


export const PaymentService = {
    initSubscriptionPayment,
    paymentSuccess,
    paymentFail,
}