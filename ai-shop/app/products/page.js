"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Loader from "@/components/Loader";

const CATEGORIES = ["All", "Electronics", "Clothing", "Books", "Home", "Sports", "Beauty"];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 12;

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (search) params.set("search", search);
      if (category !== "All") params.set("category", category);

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setLoading(false);
    }
    fetchProducts();
  }, [search, category, page]);

  // AI Recommendation state
  const [aiQuery, setAiQuery] = useState("");
  const [aiResults, setAiResults] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  async function handleAiRecommend() {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiResults(null);
    const res = await fetch("/api/ai/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productName: aiQuery,
        category: category !== "All" ? category : undefined,
      }),
    });
    const data = await res.json();
    setAiResults(data);
    setAiLoading(false);
  }

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Products</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-4 py-2 flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                category === cat
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-gray-300 text-gray-600 hover:border-indigo-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* AI Recommendation Box */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 mb-8">
        <h2 className="text-lg font-semibold text-indigo-700 mb-2">
          AI Recommendations
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="e.g. wireless headphones for gaming"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            className="flex-1 border border-indigo-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={handleAiRecommend}
            disabled={aiLoading}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-60 font-medium"
          >
            {aiLoading ? "Thinking..." : "Ask AI"}
          </button>
        </div>

        {aiResults && (
          <div className="mt-4">
            {aiResults.recommendations?.map((r, i) => (
              <div key={i} className="bg-white rounded-lg p-3 mb-2 border border-indigo-100">
                <p className="font-semibold text-gray-800">{r.name}</p>
                <p className="text-gray-500 text-sm">{r.reason}</p>
              </div>
            ))}
            {aiResults.budgetTip && (
              <p className="text-indigo-600 text-sm mt-2 font-medium">
                Tip: {aiResults.budgetTip}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <Loader text="Fetching products..." />
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-center py-16">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-full text-sm font-medium border transition ${
                p === page
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-gray-300 text-gray-600 hover:border-indigo-400"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
