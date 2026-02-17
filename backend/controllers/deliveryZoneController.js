const DeliveryZone = require("../models/DeliveryZone");

// Check delivery by pincode
exports.checkDelivery = async (req, res) => {
  try {
    const { pincode } = req.params;

    const zone = await DeliveryZone.findOne({
      pincode,
      isActive: true,
    });

    if (!zone) {
      return res.json({
        deliverable: false,
        deliveryCharge: null,
      });
    }

    res.json({
      deliverable: true,
      deliveryCharge: zone.deliveryCharge,
    });
  } catch (err) {
    res.status(500).json({ message: "Error checking delivery" });
  }
};
