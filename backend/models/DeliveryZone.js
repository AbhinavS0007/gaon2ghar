const mongoose = require("mongoose");

const deliveryZoneSchema = new mongoose.Schema(
  {
    pincode: {
      type: String,
      required: true,
      unique: true,
    },
    deliveryCharge: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeliveryZone", deliveryZoneSchema);
