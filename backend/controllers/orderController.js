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
    if (product.quantity <= 0) {
      product.quantity = 0;
      product.isActive = false;
    }
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

exports.acceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("productId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // check farmer owns the product
    if (
      order.productId.farmerId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.status = "accepted";
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("productId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // check farmer owns the product
    if (
      order.productId.farmerId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.status = "rejected";
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFarmerOrders = async (req, res) => {
  try {
    const Product = require("../models/Product");

    // get farmer's products
    const products = await Product.find({
      farmerId: req.user._id,
    });

    const productIds = products.map((p) => p._id);

    // find orders for those products
    const orders = await Order.find({
      productId: { $in: productIds },
    })
      .populate("productId")
      .populate("customerId");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
