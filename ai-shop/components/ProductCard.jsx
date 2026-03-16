"use client";

import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/cartSlice";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden flex flex-col">
      <div className="relative w-full h-48 bg-gray-100">
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs uppercase text-indigo-500 font-semibold tracking-wide">
          {product.category}
        </span>
        <Link href={`/products/${product._id}`}>
          <h3 className="text-gray-800 font-semibold text-lg mt-1 hover:text-indigo-600 line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-indigo-600 font-bold text-xl">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => dispatch(addToCart(product))}
            disabled={product.stock === 0}
            className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
