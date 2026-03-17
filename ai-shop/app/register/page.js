"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/redux/userSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, error } = useSelector((state) => state.user);
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [localError, setLocalError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError("");

    if (form.password !== form.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    const result = await dispatch(registerUser({ email: form.email, password: form.password }));

    if (registerUser.fulfilled.match(result)) {
      router.push("/products");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-2xl shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Create an Account
      </h2>

      {(error || localError) && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
          {error || localError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="min. 6 characters"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            required
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="repeat password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-60 mt-2"
        >
          {isLoading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="text-center text-gray-500 text-sm mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-indigo-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
