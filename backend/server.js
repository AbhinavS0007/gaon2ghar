const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");


dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

// test route
app.post("/test", (req, res) => {
  res.json({ message: "Test route working", body: req.body });
});

// auth routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);
const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);
const cartRoutes = require("./routes/cartRoutes");
app.use("/api/cart", cartRoutes);
const addressRoutes = require("./routes/addressRoutes");
app.use("/api/address", addressRoutes);
const deliveryZoneRoutes = require("./routes/deliveryZoneRoutes");

app.use("/api/delivery-zones", deliveryZoneRoutes);


const aiRoutes = require("./routes/aiRoutes.js");

app.use("/api/ai", aiRoutes);





// test route
app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
