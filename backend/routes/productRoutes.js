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
const upload = require("../middleware/upload");
router.post("/", protect, farmerOnly,upload.array("images", 10), addProduct);
router.get("/my", protect, farmerOnly, getMyProducts);
const { deleteProduct } = require("../controllers/productController");
router.delete("/:id", protect, farmerOnly, deleteProduct);
const { restockProduct } = require("../controllers/productController");
router.patch("/:id/restock", protect, farmerOnly, restockProduct);

module.exports = router;
