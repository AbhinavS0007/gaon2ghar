const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  addAddress,
  getAddresses,
  setDefaultAddress,
} = require("../controllers/addressController");

// GET all addresses
router.get("/", protect, getAddresses);

// ADD new address
router.post("/", protect, addAddress);

// SET default address  ✅ ADD THIS
router.put("/default/:id", protect, setDefaultAddress);

module.exports = router;

// const express = require("express");
// const {
//   getAddresses,
//   addAddress,
//   setDefaultAddress,
// } = require("../controllers/addressController");

// const router = express.Router();

// router.get("/", getAddresses);
// router.post("/", addAddress);
// router.put("/default/:id", setDefaultAddress);

// module.exports = router;

// const express = require("express");
// const router = express.Router();

// const { protect } = require("../middleware/authMiddleware");
// const {
//   addAddress,
//   getAddresses
// } = require("../controllers/addressController");

// router.post("/", protect, addAddress);
// router.get("/", protect, getAddresses);

// module.exports = router;

