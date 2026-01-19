import SSLCommerzPayment from "sslcommerz-lts";

export const sslcommerz = new SSLCommerzPayment(
  process.env.SSLC_STORE_ID!,
  process.env.SSLC_STORE_PASS!,
  process.env.SSLC_IS_LIVE === "true"
);
