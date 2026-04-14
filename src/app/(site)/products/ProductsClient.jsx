"use client";

import { useState, useEffect } from "react";
import ShopCardComponent from "../../../components/shop/ShopCardComponent";
import ProductFilterComponent from "../../../components/shop/ProductFilterComponent";

export default function ProductsClient({ initialProducts }) {
  const [catalog, setCatalog] = useState(initialProducts);
  const [shown, setShown] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const normalized = catalog.map((p) => ({
    ...p,
    productId: p.productId || p.id,
    productName: p.name || p.productName,
    categoryName: p.categoryName || p.category?.name,
  }));

  const onFilter = (result) => {
    setShown(result);
  };

  const onSearch = (val) => {
    setQuery(val);
    let result = catalog;
    if (val.trim()) {
      const q = val.toLowerCase();
      result = result.filter((p) => {
        const n = (p.name || p.productName || "").toLowerCase();
        const d = (p.description || "").toLowerCase();
        return n.includes(q) || d.includes(q);
      });
    }
    setShown(result);
  };

  const shownNormalized = shown.map((p) => ({
    ...p,
    productId: p.productId || p.id,
    productName: p.name || p.productName,
    categoryName: p.categoryName || p.category?.name,
  }));

  return (
    <div className="mx-auto w-full max-w-7xl py-10">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
            <p className="mt-1 text-gray-400">Filter by price and category to find what you need.</p>
          </div>
          {mounted && (
            <input
              type="text"
              value={query}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search products..."
              className="w-72 rounded-xl border-2 border-violet-400 px-4 py-2 text-sm focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
          )}
        </div>
      </div>

      <div className="flex gap-8">
        <ProductFilterComponent
          products={normalized}
          onFilterChange={onFilter}
          categories={[...new Set(normalized.map((p) => p.categoryName).filter(Boolean))]}
          searchTerm={query}
        />

        <div className="flex-1">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-700">
              {shownNormalized.length} {shownNormalized.length === 1 ? "product" : "products"} found
            </h2>
          </div>

          {shownNormalized.length > 0 ? (
            <div className="grid grid-cols-3 gap-6">
              {shownNormalized.map((p) => (
                <ShopCardComponent key={p.productId} product={p} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-400">No products match your filters.</p>
              <button
                onClick={() => setShown(normalized)}
                className="mt-4 text-sm font-semibold text-violet-600 hover:text-violet-700"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}