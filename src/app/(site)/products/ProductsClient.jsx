"use client";

import { useState, useEffect } from "react";
import ShopCardComponent from "../../../components/shop/ShopCardComponent";
import ProductFilterComponent from "../../../components/shop/ProductFilterComponent";

export default function InventoryBrowser({ startCatalog }) {
  const [fullCatalog, setFullCatalog] = useState(startCatalog);
  const [shownCatalog, setShownCatalog] = useState(startCatalog);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    setPageReady(true);
  }, []);

  const prepareCatalog = fullCatalog.map((entry) => ({
    ...entry,
    itemId: entry.productId || entry.id,
    itemTitle: entry.name || entry.productName,
    groupLabel: entry.categoryName || entry.category?.name,
  }));

  const processFilters = (filteredResults) => {
    setShownCatalog(filteredResults);
  };

  const liveSearch = (searchTerm) => {
    setSearchPhrase(searchTerm);
    let searchResults = fullCatalog;
    
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      searchResults = fullCatalog.filter(entry => {
        const title = (entry.name || entry.productName || "").toLowerCase();
        const desc = (entry.description || "").toLowerCase();
        return title.includes(query) || desc.includes(query);
      });
    }
    
    setShownCatalog(searchResults);
  };

  const prepareShownCatalog = shownCatalog.map((entry) => ({
    ...entry,
    itemId: entry.productId || entry.id,
    itemTitle: entry.name || entry.productName,
    groupLabel: entry.categoryName || entry.category?.name,
  }));

  return (
    <div className="w-full max-w-7xl mx-auto py-24 px-16 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100 min-h-screen overflow-hidden">
      
      <div className="mb-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-200/30 via-orange-200/20 to-rose-200/30 blur-3xl"></div>
        <div className="relative z-10 flex items-center justify-between mb-16 pt-12">
          <div className="w-1/2">
            <h1 className="text-6xl font-black bg-gradient-to-r from-amber-800 via-orange-700 to-rose-800 bg-clip-text text-transparent mb-8 leading-none drop-shadow-2xl tracking-tight">
              Luxury Inventory
            </h1>
            <p className="text-2xl text-amber-800 font-bold leading-relaxed drop-shadow-lg">
              Explore premium selection. Sort, filter, and discover unique finds.
            </p>
          </div>
          {pageReady && (
            <div className="w-96 relative group">
              <input
                type="text"
                value={searchPhrase}
                onChange={(e) => liveSearch(e.target.value)}
                placeholder="🔎 Find items, read descriptions..."
                className="w-full pl-16 pr-8 py-6 rounded-3xl border-4 border-orange-300/50 bg-white/90 backdrop-blur-xl text-2xl font-bold text-amber-900 placeholder-amber-500 focus:border-rose-400 focus:outline-none focus:ring-4 focus:ring-orange-200/60 shadow-2xl hover:shadow-3xl hover:border-rose-300/70 transition-all duration-400 group-hover:scale-[1.02]"
              />
              <svg className="absolute left-7 top-1/2 -translate-y-1/2 w-8 h-8 text-amber-600 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-20 relative z-10">
        <div className="w-96 shrink-0">
          <div className="sticky top-32 p-10 bg-white/80 backdrop-blur-2xl rounded-3xl shadow-3xl border border-orange-200/50">
            <ProductFilterComponent
              products={prepareCatalog}
              onFilterChange={processFilters}
              categories={[...new Set(prepareCatalog.map(entry => entry.groupLabel).filter(Boolean))]}
              searchTerm={searchPhrase}
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-16 flex items-center justify-between p-8 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-rose-200/50">
            <h2 className="text-3xl font-black text-amber-900 drop-shadow-lg">
              Showing {prepareShownCatalog.length} {prepareShownCatalog.length === 1 ? 'unique find' : 'treasures'}
            </h2>
            <button
              onClick={() => setShownCatalog(prepareCatalog)}
              className="px-10 py-5 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-xl font-black text-white hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:rotate-1 active:scale-95 transition-all duration-300 tracking-wide uppercase"
            >
              Clear Filters
            </button>
          </div>

          {prepareShownCatalog.length > 0 ? (
            <div className="grid grid-cols-4 gap-16">
              {prepareShownCatalog.map((entry) => (
                <div key={entry.itemId} className="group/item hover:scale-105 transition-all duration-500">
                  <ShopCardComponent product={entry} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-40 bg-white/60 rounded-4xl backdrop-blur-2xl border-4 border-dashed border-amber-300/50 shadow-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-100/50 to-rose-100/30"></div>
              <div className="relative z-10">
                <div className="w-40 h-40 mx-auto mb-16 bg-gradient-to-br from-amber-300 to-orange-300 rounded-4xl flex items-center justify-center shadow-2xl border-4 border-white/50">
                  <svg className="w-20 h-20 text-amber-600 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-5xl font-black text-amber-900 mb-8 drop-shadow-xl tracking-tight">Nothing Matches</h3>
                <p className="text-2xl text-amber-800 mb-12 max-w-3xl mx-auto leading-relaxed font-semibold drop-shadow-md">
                  No items found for your current search and filter settings. Try different keywords or broaden your criteria.
                </p>
                <button
                  onClick={() => setShownCatalog(prepareCatalog)}
                  className="px-16 py-7 rounded-4xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-2xl font-black text-white shadow-3xl hover:shadow-4xl hover:scale-105 active:scale-95 transition-all duration-300 tracking-wider uppercase letter-spacing-2"
                >
                  View Full Collection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-32 text-center p-16 bg-white/50 backdrop-blur-xl rounded-4xl border-3 border-amber-200/50 shadow-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100/30 to-rose-100/20 blur-xl"></div>
        <div className="relative z-10">
          <h3 className="text-3xl font-black text-amber-900 mb-4 drop-shadow-lg tracking-tight">
            Complete Collection: {prepareCatalog.length} items
          </h3>
          <p className="text-2xl text-amber-800 font-bold drop-shadow-md">
            Your premium shopping destination awaits
          </p>
        </div>
      </div>

      <div className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-br from-amber-400/20 via-orange-400/10 to-rose-400/20 rounded-full blur-3xl animate-pulse"></div>
    </div>
  );
}