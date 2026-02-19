const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const client = require("../utils/twilioClient");

// ==============================
// 1️⃣ SEND OTP FOR REGISTRATION
// ==============================
exports.registerSendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone is required" });
    }

    // Normalize phone (important)
    const normalizedPhone = phone.trim();

    const existingUser = await User.findOne({ phone: normalizedPhone });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: `+91${normalizedPhone}`,
        channel: "sms",
      });

    return res.json({ message: "OTP sent via SMS" });

  } catch (error) {
    console.error("Send OTP Error:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};


// =================================
// 2️⃣ VERIFY OTP + CREATE USER
// =================================
exports.registerVerifyOtp = async (req, res) => {
  try {
    const { name, phone, password, role, otp } = req.body;

    if (!name || !phone || !password || !role || !otp) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedPhone = phone.trim();

    // Check if already registered (safety check)
    const existingUser = await User.findOne({ phone: normalizedPhone });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: `+91${normalizedPhone}`,
        code: otp,
      });

    if (verification.status !== "approved") {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      phone: normalizedPhone,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "User registered successfully",
      token,
      user,
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ message: "Registration failed" });
  }
};


// ==============================
// 3️⃣ LOGIN WITH PASSWORD
// ==============================
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password required" });
    }

    const normalizedPhone = phone.trim();

    const user = await User.findOne({ phone: normalizedPhone });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user,
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
};
