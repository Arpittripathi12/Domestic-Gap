const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_API_KEY, // APP PASSWORD
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Gmail connection failed:", error);
  } else {
    console.log("✅ Email service is ready");
  }
});

const sendOtpToEmail = async (email, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color:#075e54;">🔐 Domestic-Gap Verification</h2>
      <p>Your OTP is:</p>
      <h1 style="background:#e0f7fa;padding:10px 20px;display:inline-block;">
        ${otp}
      </h1>
      <p><strong>Valid for 5 minutes.</strong></p>
      <p>Do not share this code.</p>
      <p>— Domestic-Gap Security Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: "Domestic-Gap <1061arpittripathi@gmail.com>",
    to: email,
    subject: "Your Domestic-Gap Verification Code",
    html,
  });
};

module.exports = sendOtpToEmail;
