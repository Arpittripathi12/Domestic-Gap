const axios = require("axios");
require("dotenv").config();

const sendOtpToEmail = async (email, otp) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Domestic-Gap",
          email: "1061arpittripathi@gmail.com", // MUST be verified in Brevo
        },
        to: [
          {
            email,
          },
        ],
        subject: "Your Domestic-Gap verification code",
        htmlContent: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <title>OTP Verification</title>
            </head>
            <body style="margin:0;padding:0;background-color:#f4f4f4;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:20px 0;">
                    <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:6px;padding:24px;font-family:Arial,sans-serif;color:#333;">
                      
                      <tr>
                        <td style="text-align:center;">
                          <h2 style="margin:0;color:#075e54;">
                            Domestic-Gap Verification
                          </h2>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:20px 0 10px;">
                          <p style="margin:0;font-size:14px;">
                            Use the verification code below to complete your sign-in:
                          </p>
                        </td>
                      </tr>

                      <tr>
                        <td align="center" style="padding:20px 0;">
                          <div style="
                            font-size:28px;
                            font-weight:bold;
                            letter-spacing:4px;
                            background:#e0f7fa;
                            padding:12px 24px;
                            border-radius:4px;
                            display:inline-block;
                          ">
                            ${otp}
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <p style="font-size:13px;margin:0;">
                            This code is valid for <strong>5 minutes</strong>.
                          </p>
                          <p style="font-size:13px;margin:8px 0 0;">
                            Please do not share this code with anyone.
                          </p>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding-top:24px;">
                          <p style="font-size:12px;color:#777;margin:0;">
                            If you did not request this code, you can safely ignore this email.
                          </p>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding-top:20px;">
                          <p style="font-size:12px;color:#777;margin:0;">
                            — Domestic-Gap Security Team
                          </p>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY, // xkeysib-xxxx
          "Content-Type": "application/json",
        },
      }
    );

    console.log("📨 OTP email sent:", response.data.messageId);
  } catch (error) {
    console.error(
      "❌ Failed to send OTP email:",
      error.response?.data || error.message
    );
    throw error;
  }
};

module.exports = sendOtpToEmail;
