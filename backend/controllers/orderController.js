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
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Check farmer owns this product
    if (
      order.productId.farmerId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    // Prevent double rejection
    if (order.status === "rejected") {
      return res.status(400).json({
        message: "Order already rejected",
      });
    }

    // Restore stock
    const product = await Product.findById(
      order.productId._id
    );

    product.quantity += order.quantity;

    // Reactivate product if needed
    if (product.quantity > 0) {
      product.isActive = true;
    }

    await product.save();

    // Update order status
    order.status = "rejected";
    await order.save();

    res.json({
      message: "Order rejected and stock restored",
      order,
    });
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

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "accepted",
      "packed",
      "out_for_delivery",
      "delivered",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const order = await Order.findById(req.params.id)
      .populate("productId");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Check farmer ownership
    if (
      order.productId.farmerId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    // Prevent modifying finalized orders
    if (
      ["delivered", "cancelled", "rejected"].includes(order.status)
    ) {
      return res.status(400).json({
        message: "Order already finalized",
      });
    }

    // 🔥 RESTORE STOCK IF REJECTING
    if (status === "rejected") {

      if (order.status !== "pending") {
        return res.status(400).json({
          message: "Only pending orders can be rejected",
        });
      }

      const product = await Product.findById(order.productId._id);

      if (product) {
        product.quantity += order.quantity;

        // Reactivate if needed
        if (product.quantity > 0) {
          product.isActive = true;
        }

        await product.save();
      }
    }

    order.status = status;
    await order.save();

    res.json(order);

  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: err.message });
  }
};




exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: "Cannot cancel this order" });
    }

    // Restore stock
    const product = await Product.findById(order.productId);

    if (product) {
      product.quantity += order.quantity;
      await product.save();
    }

    order.status = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully" });

  } catch (error) {
    console.error("Cancel Error:", error);
    res.status(500).json({ message: "Cancel failed" });
  }
};


exports.rateOrder = async (req, res) => {
  const { rating, review } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) return res.status(404).json({ message: "Not found" });

  if (order.status !== "delivered") {
    return res.status(400).json({ message: "Cannot rate yet" });
  }

  order.rating = rating;
  order.review = review;

  await order.save();

  res.json({ message: "Thanks for rating!" });
};
