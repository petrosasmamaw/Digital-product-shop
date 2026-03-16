import { GoogleGenerativeAI } from "@google/generative-ai";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { productName, category, budget } = req.body;

  if (!productName) {
    return res.status(400).json({ error: "productName is required" });
  }

  try {
    await connectToDatabase();

    // Fetch relevant products from DB for context
    const products = await Product.find(
      category ? { category } : {}
    )
      .limit(20)
      .lean();

    const productList = products
      .map((p) => `- ${p.name} ($${p.price}) [${p.category}]: ${p.description}`)
      .join("\n");

    const prompt = `You are a helpful AI shopping assistant for an e-commerce store.
A user is interested in: "${productName}"${category ? ` in category: ${category}` : ""}${budget ? ` with a budget of $${budget}` : ""}.

Here are the available products in our store:
${productList || "No products currently available."}

Please provide:
1. 3 recommended products from the list above that best match the user's needs.
2. A brief reason for each recommendation.
3. One budget tip if applicable.

Format your response as JSON:
{
  "recommendations": [
    { "name": "...", "reason": "..." },
    { "name": "...", "reason": "..." },
    { "name": "...", "reason": "..." }
  ],
  "budgetTip": "..."
}`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(200).json({ raw: text, recommendations: [], budgetTip: "" });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return res.status(200).json(parsed);
  } catch (err) {
    console.error("AI recommendation error:", err);
    return res.status(500).json({ error: "Failed to generate recommendations" });
  }
}
