const Address = require("../models/Address");


exports.getAddresses = async (req, res) => {
    try {
      const addresses = await Address.find({ userId: req.user._id });
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
      await Address.updateMany(
        { userId: req.user._id },
        { isDefault: false }
      );
    }

    const address = await Address.create({
      ...data,
      userId: req.user._id,
    });

    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ message: "Error adding address" });
  }
};

// PUT set default address
exports.setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    await Address.updateMany(
      { userId: req.user._id },
      { isDefault: false }
    );

    const address = await Address.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { isDefault: true },
      { new: true }
    );

    res.json(address);
  } catch (error) {
    res.status(500).json({ message: "Error setting default address" });
  }
};
