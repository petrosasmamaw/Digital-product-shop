"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "@/redux/userSlice";
import { clearCart } from "@/redux/cartSlice";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  async function handleLogout() {
    await supabase.auth.signOut();
    dispatch(clearUser());
    dispatch(clearCart());
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          AI Shop
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/products" className="text-gray-600 hover:text-indigo-600 font-medium">
            Products
          </Link>

          <Link href="/cart" className="relative text-gray-600 hover:text-indigo-600 font-medium">
            Cart
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-3 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-600 hover:text-indigo-600 font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
