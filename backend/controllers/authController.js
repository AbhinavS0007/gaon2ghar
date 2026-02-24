const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// ================= SEND OTP =================
exports.registerSendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    await User.findOneAndUpdate(
      { email: normalizedEmail },
      {
        email: normalizedEmail,
        otp,
        otpExpires: otpExpiry,
        isVerified: false,
      },
      { upsert: true, new: true }
    );

    await sendEmail(
      normalizedEmail,
      "Gaon2Ghar OTP Verification",
      `Your OTP is ${otp}`
    );

    res.json({ message: "OTP sent successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ================= VERIFY OTP =================
exports.registerVerifyOtp = async (req, res) => {
    try {
      const { name, email, password, role, otp } = req.body;
  
      if (!name || !email || !password || !role || !otp) {
        return res.status(400).json({ message: "All fields required" });
      }
  
      const normalizedEmail = email.trim().toLowerCase();
  
      const user = await User.findOne({ email: normalizedEmail });
  
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      if (String(user.otp).trim() !== String(otp).trim()) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
  
      if (user.otpExpires < Date.now()) {
        return res.status(400).json({ message: "OTP expired" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      user.name = name.trim();
      user.password = hashedPassword;
      user.role = role;
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
  
      await user.save();
  
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

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !user.isVerified) {
      return res.status(400).json({ message: "User not found or not verified" });
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

    res.json({ token, user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};