const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getFarmerOrders,
  updateOrderStatus,
  acceptOrder,
  rejectOrder,
} = require("../controllers/orderController");


const {
  protect,
  customerOnly,
  farmerOnly,
} = require("../middleware/authMiddleware");

// customer only routes
router.post("/", protect, customerOnly, placeOrder);
router.get("/my", protect, getMyOrders);
router.get("/farmer", protect, farmerOnly, getFarmerOrders);

router.patch("/:id/accept", protect, farmerOnly, acceptOrder);
router.patch("/:id/reject", protect, farmerOnly, rejectOrder);


module.exports = router;
