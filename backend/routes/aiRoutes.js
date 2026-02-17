const express = require("express");
const router = express.Router();

const { processAIOrder } = require("../controllers/aiController");

const { protect, customerOnly } = require("../middleware/authMiddleware");

router.post("/order", protect, customerOnly, processAIOrder);

module.exports = router;
