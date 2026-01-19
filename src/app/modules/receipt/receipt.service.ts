import PDFDocument from "pdfkit";
import fs from "fs";

const generateReceipt = async (payment: any) => {
  const doc = new PDFDocument();
  const path = `receipts/${payment.id}.pdf`;

  doc.pipe(fs.createWriteStream(path));
  doc.fontSize(20).text("Travel Booking Receipt");
  doc.text(`Payment ID: ${payment.id}`);
  doc.text(`Amount: ${payment.amount} BDT`);
  doc.text(`Seats: ${payment.seats}`);
  doc.text(`Status: PAID`);
  doc.end();

  return path;
};

export const ReceiptService = {
  generateReceipt,
};