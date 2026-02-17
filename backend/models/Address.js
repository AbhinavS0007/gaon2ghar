const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    
    fullName: String,
    phone: String,
    houseNumber: String,
    street: String,
    landmark: String,
    city: String,
    state: String,
    pincode: String,
    addressType: {
      type: String,
      enum: ["Home", "Work", "Other"],
      default: "Home",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
