import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import { authMiddleware } from "@/utils/authMiddleware";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      const { category, search, page = 1, limit = 12 } = req.query;
      const query = {};

      if (category) query.category = category;
      if (search) query.name = { $regex: search, $options: "i" };

      const skip = (Number(page) - 1) * Number(limit);
      const [products, total] = await Promise.all([
        Product.find(query).skip(skip).limit(Number(limit)).lean(),
        Product.countDocuments(query),
      ]);

      return res.status(200).json({ products, total, page: Number(page), limit: Number(limit) });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch products" });
    }
  }

  if (req.method === "POST") {
    const { user, error } = await authMiddleware(req);
    if (error) return res.status(401).json({ error });

    try {
      const product = await Product.create(req.body);
      return res.status(201).json(product);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
