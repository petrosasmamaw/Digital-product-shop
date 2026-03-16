import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import { authMiddleware } from "@/utils/authMiddleware";

export default async function handler(req, res) {
  await connectToDatabase();
  const { user, error } = await authMiddleware(req);
  if (error) return res.status(401).json({ error });

  if (req.method === "GET") {
    try {
      const orders = await Order.find({ userId: user.id })
        .sort({ createdAt: -1 })
        .lean();
      return res.status(200).json(orders);
    } catch {
      return res.status(500).json({ error: "Failed to fetch orders" });
    }
  }

  if (req.method === "POST") {
    try {
      const { items, totalPrice, shippingAddress } = req.body;
      if (!items || !items.length || !totalPrice) {
        return res.status(400).json({ error: "Invalid order data" });
      }
      const order = await Order.create({
        userId: user.id,
        items,
        totalPrice,
        shippingAddress,
      });
      return res.status(201).json(order);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
