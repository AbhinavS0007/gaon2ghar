const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "packed",
        "out_for_delivery",
        "delivered",
        "rejected",
        "cancelled",
      ],
      default: "pending",
    },
    rating: {
      type: Number,
      default: 0,
    },
    review: {
      type: String,
    },
    
    address: {
      type: String,
      required: true,
    },
    
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
