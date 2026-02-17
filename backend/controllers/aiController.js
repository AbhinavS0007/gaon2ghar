const Product = require("../models/Product");
const Order = require("../models/Order");
const DeliveryZone = require("../models/DeliveryZone");
const Address = require("../models/Address");
const { parseOrderText } = require("../utils/parseOrderText");

const processAIOrder = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // 1️⃣ Parse natural language
    const parsed = parseOrderText(message);

    if (parsed.error) {
      return res.status(400).json({
        success: false,
        message: parsed.error,
      });
    }

    const { quantity, productName } = parsed;

    // 2️⃣ Find product
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

    // 3️⃣ ALWAYS fetch address from DB (never trust frontend)
    let defaultAddress = await Address.findOne({
      userId: req.user._id,
      isDefault: true,
    });

    if (!defaultAddress) {
      defaultAddress = await Address.findOne({
        userId: req.user._id,
      });
    }

    if (!defaultAddress) {
      return res.status(400).json({
        success: false,
        message: "Please add an address first",
      });
    }

    // 4️⃣ DELIVERY VALIDATION
    const deliveryZone = await DeliveryZone.findOne({
      pincode: defaultAddress.pincode.toString(),
    });

    console.log(deliveryZone);
    

    if (!deliveryZone || deliveryZone.isActive !== true) {
      return res.status(400).json({
        success: false,
        message: "Delivery not available in your area try changing location",
      });
    }

    const deliveryCharge = deliveryZone.deliveryCharge || 0;

    // 5️⃣ Build full address string
    const fullAddress = `
${defaultAddress.houseNumber},
${defaultAddress.street},
${defaultAddress.landmark},
${defaultAddress.city},
${defaultAddress.state} - ${defaultAddress.pincode}
`;

    // 6️⃣ Calculate total
    const totalPrice = quantity * product.price + deliveryCharge;

    // 7️⃣ Create order
    const order = await Order.create({
      customerId: req.user._id,
      productId: product._id,
      quantity,
      totalPrice,
      address: fullAddress,
      status: "pending",
    });

    // 8️⃣ Reduce stock
    product.quantity -= quantity;
    await product.save();

    res.status(201).json({
      success: true,
      message: `Order placed successfully. Delivery charge ₹${deliveryCharge} applied.`,
      order,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { processAIOrder };
