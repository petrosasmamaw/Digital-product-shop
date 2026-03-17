const express = require("express");
const router = express.Router();
const connectToDatabase = require("../lib/mongodb");
const Order = require("../models/Order");

// GET /orders - Get user's orders
router.get("/", async (req, res) => {
  try {
    await connectToDatabase();
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    const orders = await Order.find({ userId })
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
    const { items, totalPrice, shippingAddress, userId } = req.body;
    if (!items || !items.length || !totalPrice || !userId) {
      return res.status(400).json({ error: "Invalid order data" });
    }
    const order = await Order.create({
      userId,
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