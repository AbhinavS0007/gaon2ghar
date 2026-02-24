const express = require("express");
const router = express.Router();
const {
  registerSendOtp,
  registerVerifyOtp,
  login,
  googleLogin, setRole,
} = require("../controllers/authController");

router.post("/register-send-otp", registerSendOtp);
router.post("/register-verify-otp", registerVerifyOtp);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/set-role", setRole);



module.exports = router;
