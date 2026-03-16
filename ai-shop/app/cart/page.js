"use client";

import { useSelector, useDispatch } from "react-redux";
import CartItem from "@/components/CartItem";
import { clearCart } from "@/redux/cartSlice";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function CartPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items, totalQuantity, totalPrice } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user.user);

  async function handleCheckout() {
    if (!user) {
      router.push("/login");
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: items.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        totalPrice,
      }),
    });

    if (res.ok) {
      dispatch(clearCart());
      router.push("/dashboard");
    } else {
      alert("Checkout failed. Please try again.");
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
        <button
          onClick={() => router.push("/products")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Your Cart ({totalQuantity} items)
      </h1>

      <div className="flex flex-col gap-4 mb-8">
        {items.map((item) => (
          <CartItem key={item._id} item={item} />
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between text-lg font-semibold text-gray-800 mb-4">
          <span>Total</span>
          <span className="text-indigo-600">${totalPrice.toFixed(2)}</span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 text-lg"
        >
          Checkout
        </button>
        <button
          onClick={() => dispatch(clearCart())}
          className="w-full mt-3 text-red-500 hover:underline text-sm"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}
