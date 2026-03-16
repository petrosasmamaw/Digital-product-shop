import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
      <h1 className="text-5xl font-extrabold text-gray-800">
        Welcome to <span className="text-indigo-600">AI Shop</span>
      </h1>
      <p className="text-gray-500 text-lg max-w-xl">
        Discover products tailored for you. Browse our catalog, add items to
        your cart, and let our AI recommend the best options for your needs.
      </p>
      <div className="flex gap-4 mt-4">
        <Link
          href="/products"
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-indigo-700"
        >
          Shop Now
        </Link>
        <Link
          href="/register"
          className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-xl text-lg font-semibold hover:bg-indigo-50"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
