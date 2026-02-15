const Order = require("../models/Order");
const Product = require("../models/Product");

// Place order (customer only)
exports.placeOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    const totalPrice = product.price * quantity;

    const order = await Order.create({
      customerId: req.user._id,
      productId,
      quantity,
      totalPrice,
    });

    // reduce product stock
    product.quantity -= quantity;
    await product.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get customer’s orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      customerId: req.user._id,
    }).populate("productId", "name price");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
