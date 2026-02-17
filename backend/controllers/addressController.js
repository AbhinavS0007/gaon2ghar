const Address = require("../models/Address");

// GET all addresses
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find();
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching addresses" });
  }
};

// POST add new address
exports.addAddress = async (req, res) => {
  try {
    const data = req.body;

    if (data.isDefault) {
      await Address.updateMany({}, { isDefault: false });
    }

    const address = await Address.create(data);
    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ message: "Error adding address" });
  }
};

// PUT set default address
exports.setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    await Address.updateMany({}, { isDefault: false });

    const address = await Address.findByIdAndUpdate(
      id,
      { isDefault: true },
      { new: true }
    );

    res.json(address);
  } catch (error) {
    res.status(500).json({ message: "Error setting default address" });
  }
};
