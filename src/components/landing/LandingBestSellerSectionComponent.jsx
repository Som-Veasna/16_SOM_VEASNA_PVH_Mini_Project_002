import React from "react";
import ProductCardComponent from "../ProductCardComponent";

export default function LandingBestSellerSectionComponent({ items }) {
  return (
    <section className="mx-auto w-full max-w-7xl py-16">
      <div className="flex flex-col gap-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Top Picks This Week
          </h2>
          <p className="mt-2 text-gray-400">
            Hit + to add items — your cart updates instantly in the header.
          </p>
        </div>
      </div>
      <div className="mt-10 grid grid-cols-4 gap-5">
        {items.map((item, idx) => (
          <ProductCardComponent product={item} key={idx} />
        ))}
      </div>
    </section>
  );
}