const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getFarmerOrders,
  updateOrderStatus,
  acceptOrder,
  rejectOrder,
  cancelOrder,
  rateOrder,
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

router.patch("/:id/status", protect, farmerOnly, updateOrderStatus);

router.patch("/:id/cancel", protect, customerOnly, cancelOrder);
router.patch("/:id/rate", protect, customerOnly, rateOrder);





module.exports = router;
