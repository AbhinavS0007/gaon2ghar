const express = require("express");
const {
  getAddresses,
  addAddress,
  setDefaultAddress,
} = require("../controllers/addressController");

const router = express.Router();

router.get("/", getAddresses);
router.post("/", addAddress);
router.put("/default/:id", setDefaultAddress);

module.exports = router;
