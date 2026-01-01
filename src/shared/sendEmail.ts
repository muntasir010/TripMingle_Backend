import nodemailer from "nodemailer";
import config from "../config";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

const sendEmail = async ({ to, subject, html }: EmailPayload) => {
  const transporter = nodemailer.createTransport({
    host: config.email_host,
    port: Number(config.email_port),
    secure: false,
    auth: {
      user: config.email_user,
      pass: config.email_pass,
    },
  });

  await transporter.sendMail({
    from: `"TripMingle" <${config.email_user}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;
