const express = require("express");
const router = express.Router();
const connectToDatabase = require("../lib/mongodb");
const Product = require("../models/Product");

// GET /products - Get all products with optional filters
router.get("/", async (req, res) => {
  try {
    await connectToDatabase();
    const { category, search, page = 1, limit = 12 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).skip(skip).limit(Number(limit)).lean(),
      Product.countDocuments(query),
    ]);

    res.status(200).json({ products, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// POST /products - Create a new product
router.post("/", async (req, res) => {
  try {
    await connectToDatabase();
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /products/:id - Get a single product
router.get("/:id", async (req, res) => {
  try {
    await connectToDatabase();
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// PUT /products/:id - Update a product
router.put("/:id", async (req, res) => {
  try {
    await connectToDatabase();
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /products/:id - Delete a product
router.delete("/:id", async (req, res) => {
  try {
    await connectToDatabase();
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.status(200).json({ message: "Product deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;