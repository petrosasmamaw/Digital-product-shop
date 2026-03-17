const express = require("express");
const router = express.Router();
const connectToDatabase = require("../lib/mongodb");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");

// All routes require auth
router.use(authMiddleware);

// GET /orders - Get user's orders
router.get("/", async (req, res) => {
  try {
    await connectToDatabase();
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json(orders);
  } catch {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// POST /orders - Create a new order
router.post("/", async (req, res) => {
  try {
    await connectToDatabase();
    const { items, totalPrice, shippingAddress } = req.body;
    if (!items || !items.length || !totalPrice) {
      return res.status(400).json({ error: "Invalid order data" });
    }
    const order = await Order.create({
      userId: req.user.id,
      items,
      totalPrice,
      shippingAddress,
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;