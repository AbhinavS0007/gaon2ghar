const express = require("express");
const router = express.Router();
const {
  registerSendOtp,
  registerVerifyOtp,
  login,
} = require("../controllers/authController");

router.post("/register-send-otp", registerSendOtp);
router.post("/register-verify-otp", registerVerifyOtp);
router.post("/login", login);

module.exports = router;
