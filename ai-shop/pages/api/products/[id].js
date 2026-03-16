import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import { authMiddleware } from "@/utils/authMiddleware";

export default async function handler(req, res) {
  await connectToDatabase();
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const product = await Product.findById(id).lean();
      if (!product) return res.status(404).json({ error: "Product not found" });
      return res.status(200).json(product);
    } catch {
      return res.status(500).json({ error: "Failed to fetch product" });
    }
  }

  if (req.method === "PUT") {
    const { user, error } = await authMiddleware(req);
    if (error) return res.status(401).json({ error });

    try {
      const updated = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updated) return res.status(404).json({ error: "Product not found" });
      return res.status(200).json(updated);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  if (req.method === "DELETE") {
    const { user, error } = await authMiddleware(req);
    if (error) return res.status(401).json({ error });

    try {
      const deleted = await Product.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: "Product not found" });
      return res.status(200).json({ message: "Product deleted" });
    } catch {
      return res.status(500).json({ error: "Failed to delete product" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
