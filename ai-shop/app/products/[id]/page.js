"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/cartSlice";
import { fetchProductAsync } from "@/redux/productsSlice";
import Image from "next/image";
import Link from "next/link";
import Loader from "@/components/Loader";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const productId = params.id;
  const { currentProduct, productLoading, productError } = useSelector((state) => state.products);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductAsync(productId));
    }
  }, [productId, dispatch]);

  const handleAddToCart = () => {
    if (currentProduct) {
      // Add the product to cart with the selected quantity
      for (let i = 0; i < quantity; i++) {
        dispatch(addToCart(currentProduct));
      }
      // Could add a toast notification here
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => {
      const newQuantity = prev + change;
      return Math.max(1, Math.min(newQuantity, currentProduct?.stock || 1));
    });
  };

  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader text="Loading product..." />
      </div>
    );
  }

  if (productError || !currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {productError || "Product not found"}
          </h1>
          <Link
            href="/products"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const product = currentProduct;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/products" className="text-indigo-600 hover:text-indigo-800">
            Products
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{product.name}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative w-full h-96 bg-gray-100 rounded-xl overflow-hidden">
                <Image
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <span className="inline-block bg-indigo-100 text-indigo-800 text-sm font-semibold px-3 py-1 rounded-full mb-2">
                  {product.category}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-3xl font-bold text-indigo-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className={`text-sm font-medium px-2 py-1 rounded ${
                    product.stock > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Rating (if available) */}
              {product.rating && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {product.rating.toFixed(1)} ({product.numReviews} reviews)
                  </span>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-900">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-center min-w-[3rem]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {product.stock === 0 ? "Out of Stock" : `Add ${quantity} to Cart - $${(product.price * quantity).toFixed(2)}`}
                </button>
              </div>

              {/* Back to Products */}
              <Link
                href="/products"
                className="inline-block text-indigo-600 hover:text-indigo-800 font-medium"
              >
                ← Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}