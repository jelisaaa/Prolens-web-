const express = require("express");
const cors = require("cors");
const { connectDB, sequelize } = require("./database/database");

require("./models/userModel");
require("./models/productModel");
require("./models/reviewModel");
require("./routes/productRoute");
require('dotenv').config();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use("/uploads",express.static("uploads"));


app.use("/api/user", require("./routes/userRoute"));
app.use("/api/products",require ("./routes/productRoute"));

app.use("/api/shipping", require("./routes/shippingRoute"));
app.use("/api/cart", require('./routes/cartRoute'));
app.use("/api/order", require('./routes/orderRoute'));
app.use("/api/review", require("./routes/reviewRoute"));


app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Home page" });
});

const startServer = async () => {
  await connectDB();
  await sequelize.sync({alter: true});
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
};

startServer();