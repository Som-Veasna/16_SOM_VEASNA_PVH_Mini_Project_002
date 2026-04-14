"use client";

import Link from "next/link";
import Image from "next/image";
import { StarRow } from "./ProductCardComponent";
import ButtonAddComponent from "./ButtonAddComponent";

const categoryColors = {
  Skincare: "bg-sky-50 text-sky-700",
  Makeup: "bg-rose-50 text-rose-700",
  Fragrance: "bg-amber-50 text-amber-800",
  Haircare: "bg-emerald-50 text-emerald-700",
};

function getCategoryStyle(name) {
  return categoryColors[name] ?? "bg-indigo-50 text-indigo-700";
}

const viewBtnClass = "mt-2 block w-full rounded-xl border border-violet-600 bg-violet-600 py-2.5 text-center text-sm font-bold text-white transition hover:bg-violet-500";

export default function ShopCardComponent({ product }) {
  const { productId, productName, description, price, imageUrl, categoryName, category, colors, sizes } = product;

  const catLabel = categoryName || category?.name || "Product";
  const hasOptions = (colors && colors.length > 1) || (sizes && sizes.length > 1);

  return (
    <article className="group max-w-75 flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={productName}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-gray-100 to-violet-50/30 text-gray-300">◇</div>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ButtonAddComponent product={product} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-bold leading-snug text-gray-900">{productName}</h3>
          <p className="mt-1 min-h-10 line-clamp-2 text-sm leading-5 text-gray-400">
            {description || "No description available."}
          </p>
        </div>
        <StarRow />
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-2">
          <div className="flex flex-col">
            <p className="text-xl font-bold tabular-nums text-gray-900">${price}</p>
            {hasOptions && <p className="text-xs text-gray-400 mt-1">Multiple options</p>}
          </div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getCategoryStyle(catLabel)}`}>
            {catLabel}
          </span>
        </div>
        <Link href={`/products/${productId}`} className={viewBtnClass}>View Product</Link>
      </div>
    </article>
  );
}