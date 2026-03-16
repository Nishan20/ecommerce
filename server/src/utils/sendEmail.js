import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config({ path: './src/config/config.env' });

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const { email, subject, message } = options;

  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: email,
    subject,
    html: message,
  };

  try {
    await transporter.sendMail(mailOptions);

  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Email could not be sent');
  }
};

export default sendEmail;

