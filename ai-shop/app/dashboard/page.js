"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { fetchUserOrders } from "@/redux/ordersSlice";

export default function DashboardPage() {
  const user = useSelector((state) => state.user.user);
  const { orders, loading, error } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    async function loadOrders() {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      dispatch(fetchUserOrders(token));
    }

    loadOrders();
  }, [user, router, dispatch]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">{user.email}</p>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">My Orders</h2>

      {loading ? (
        <Loader text="Loading orders..." />
      ) : orders.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-gray-400">Order ID: {order._id}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="text-indigo-600 font-bold">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-2 text-sm text-gray-700">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
