const Product = require("../models/Product");

// Add product (farmer only)
exports.addProduct = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;

    const product = await Product.create({
      name,
      price,
      quantity,
      farmerId: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products (public)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("farmerId", "name phone");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get farmer’s own products
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmerId: req.user._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
