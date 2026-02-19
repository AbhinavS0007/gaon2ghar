const mongoose = require("mongoose");

const registerOtpSchema = new mongoose.Schema({
  name: String,
  phone: String,
  password: String, // hashed password stored temporarily
  role: String,
  otp: String,
  expiresAt: Date,
});

module.exports = mongoose.model("RegisterOtp", registerOtpSchema);
