"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { ESSENTIALS_TABS, filterProductsByEssentialsTab, products } from "../../data/mockData";
import ProductCardComponent from "../ProductCardComponent";

const ITEMS_PER_PAGE = 8;

export default function LandingEssentialsGrid() {
  const [activeTab, setActiveTab] = useState("All");
  const [expanded, setExpanded] = useState(false);

  const visibleProducts = filterProductsByEssentialsTab(products, activeTab);
  const displayed = expanded ? visibleProducts : visibleProducts.slice(0, ITEMS_PER_PAGE);
  const hasMore = !expanded && visibleProducts.length > ITEMS_PER_PAGE;

  return (
    <section id="shop" className="mx-auto w-full max-w-7xl py-16">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Daily Skincare Picks
        </h2>
        <p className="mt-2 max-w-lg text-gray-400">
          Browse by routine step — same catalog, organized for quick discovery.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Skincare tabs">
        {ESSENTIALS_TABS.map((name) => {
          const selected = activeTab === name;
          return (
            <Button
              key={name}
              role="tab"
              aria-selected={selected}
              onPress={() => { setActiveTab(name); setExpanded(false); }}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                selected
                  ? "bg-violet-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {name}
            </Button>
          );
        })}
      </div>

      <div className="mt-10 grid grid-cols-4 gap-5">
        {displayed.map((item, idx) => (
          <ProductCardComponent product={item} key={idx} />
        ))}
      </div>

      {visibleProducts.length === 0 && (
        <p className="mt-10 text-center text-gray-400">Nothing here — try "All".</p>
      )}

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <Button
            variant="secondary"
            onPress={() => setExpanded(true)}
            className="rounded-full border border-gray-200 bg-white px-10 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
          >
            Show more
          </Button>
        </div>
      )}
    </section>
  );
}