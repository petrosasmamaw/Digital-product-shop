"use client";

import { useDispatch } from "react-redux";
import { addToCart, decreaseQuantity, removeFromCart } from "@/redux/cartSlice";
import Image from "next/image";

export default function CartItem({ item }) {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center gap-4 bg-white rounded-xl shadow p-4">
      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
        <Image
          src={item.image || "/placeholder.png"}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{item.name}</h4>
        <p className="text-indigo-600 font-bold">${item.price.toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => dispatch(decreaseQuantity(item._id))}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-lg font-bold"
        >
          −
        </button>
        <span className="w-6 text-center font-semibold">{item.quantity}</span>
        <button
          onClick={() => dispatch(addToCart(item))}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-lg font-bold"
        >
          +
        </button>
      </div>

      <div className="text-right min-w-[80px]">
        <p className="text-gray-700 font-semibold">${item.subtotal.toFixed(2)}</p>
        <button
          onClick={() => dispatch(removeFromCart(item._id))}
          className="text-red-500 text-xs hover:underline mt-1"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
