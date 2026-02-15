const express = require("express");
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  getMyProducts,
} = require("../controllers/productController");

const {
  protect,
  farmerOnly,
} = require("../middleware/authMiddleware");

// public
router.get("/", getAllProducts);

// farmer only
router.post("/", protect, farmerOnly, addProduct);
router.get("/my", protect, farmerOnly, getMyProducts);

module.exports = router;
