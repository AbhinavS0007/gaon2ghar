const Product = require("../models/Product");

// Add product (farmer only)
exports.addProduct = async (req, res) => {
  try {
    const { name, price, quantity, description} = req.body;

    const product = await Product.create({
      name,
      price,
      quantity,
      description,
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
    const products = await Product.find({ isActive: true });
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

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      farmerId: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.addProduct = async (req, res) => {
  try {
    const { name, price, quantity, description } = req.body;

    // collect image URLs
    const imageUrls = req.files.map((file) => file.path);

    const product = await Product.create({
      name,
      price,
      quantity,
      description,
      images: imageUrls,
      farmerId: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.restockProduct = async (req, res) => {
  try {
    const { quantity } = req.body;

    const product = await Product.findOne({
      _id: req.params.id,
      farmerId: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.quantity += Number(quantity);

    if (product.quantity > 0) {
      product.isActive = true;
    }

    await product.save();

    res.json({ message: "Product restocked", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
