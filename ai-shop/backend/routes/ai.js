// Ensure dotenv is loaded if this file is run independently, 
// though your server.js usually handles this.
require("dotenv").config(); 
const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const connectToDatabase = require("../lib/mongodb");
const Product = require("../models/Product");

// Initialize AI outside the route to save resources
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

router.post("/recommend", async (req, res) => {
  const { productName, category, budget } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    console.error("ERROR: GEMINI_API_KEY is missing from .env");
    return res.status(500).json({ error: "AI configuration error" });
  }

  if (!productName) {
    return res.status(400).json({ error: "productName is required" });
  }

  try {
    await connectToDatabase();

    const filter = (category && category !== "All") ? { category } : {};
    const products = await Product.find(filter).limit(15).lean();

    const productList = products.length > 0 
      ? products.map(p => `- Name: ${p.name}, Price: $${p.price}, Desc: ${p.description}`).join("\n")
      : "No specific matches in catalog, suggest general items.";

    const prompt = `You are an e-commerce assistant. 
User wants: "${productName}" ${budget ? `with budget $${budget}` : ""}.
Available Items:
${productList}

Return ONLY a JSON object with this structure:
{
  "recommendations": [{ "name": "item name", "reason": "why" }],
  "budgetTip": "one tip"
}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Use a standard call and manually parse to avoid 500s from strict mime-type configs
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the string: find the first '{' and last '}'
    const startIdx = text.indexOf('{');
    const endIdx = text.lastIndexOf('}');
    
    if (startIdx === -1 || endIdx === -1) {
      throw new Error("AI did not return valid JSON block");
    }

    const jsonString = text.substring(startIdx, endIdx + 1);
    const parsed = JSON.parse(jsonString);

    res.status(200).json(parsed);

  } catch (err) {
    console.error("Detailed AI Error:", err.message);
    res.status(500).json({ 
      error: "Failed to generate recommendations", 
      details: err.message 
    });
  }
});

module.exports = router;