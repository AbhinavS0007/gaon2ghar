const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendWhatsappOtp = async (phone, otp) => {
  try {
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER, 
      to: `whatsapp:+91${phone}`, // India country code
      body: `Your Gaon2Ghar registration OTP is: ${otp}`,
    });

    console.log("OTP sent successfully to WhatsApp");
  } catch (error) {
    console.error("Full Twilio Error:", error);
    throw error;
  }
  
};

module.exports = sendWhatsappOtp;
