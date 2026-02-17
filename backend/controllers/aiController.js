const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const { parseOrderText } = require("../utils/parseOrderText");

const processAIOrder = async (req, res, next) => {
    try {
      const { message, address } = req.body;
  
      if (!message) {
        return res.status(400).json({
          success: false,
          message: "Message is required",
        });
      }
  
      if (!address) {
        return res.status(400).json({
          success: false,
          message: "Delivery address is required",
        });
      }
  
      const parsed = parseOrderText(message);
  
      if (parsed.error) {
        return res.status(400).json({
          success: false,
          message: parsed.error,
        });
      }
  
      const { quantity, productName } = parsed;
  
      const product = await Product.findOne({
        name: { $regex: productName, $options: "i" },
      });
  
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
  
      if (product.quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: "Not enough stock available",
        });
      }
  
      const totalPrice = quantity * product.price;
  
      const order = await Order.create({
        customerId: req.user._id,
        productId: product._id,
        quantity,
        totalPrice,
        address,
        status: "pending",
      });
  
      product.quantity -= quantity;
      await product.save();
  
      res.status(201).json({
        success: true,
        message: `Order placed successfully for ${quantity} kg ${product.name}`,
        order,
      });
    } catch (error) {
      next(error);
    }
  };
  

module.exports = { processAIOrder };
