/* eslint-disable */
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "mailhog",
  port: 1025,
  secure: false,
});

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
) => {
  const resetUrl = `http://localhost:3000/auth/reset-password/${resetToken}`;
  const mailOptions = {
    from: "your-email@example.com",
    to: email,
    subject: "Passwort zurücksetzen",
    text: `Klicke auf den folgenden Link, um dein Passwort zurückzusetzen: ${resetUrl}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Passwort zurücksetzen E-Mail gesendet!");
  } catch (error) {
    console.error("Fehler beim Senden der E-Mail:", error);
  }
};
