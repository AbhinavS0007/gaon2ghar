const express = require("express");
const { checkDelivery } = require("../controllers/deliveryZoneController");

const router = express.Router();

router.get("/:pincode", checkDelivery);

module.exports = router;
