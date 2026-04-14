"use client";

import Image from "next/image";
import Link from "next/link";
import ButtonAddComponent from "./ButtonAddComponent";

export function StarRow({ rating = 4.8 }) {
  return (
    <p className="flex items-center gap-0.5 text-amber-400" aria-label={`${rating} stars`}>
      <span className="text-sm">★★★★★</span>
      <span className="ml-1 text-xs tabular-nums text-gray-400">{rating}</span>
    </p>
  );
}

export default function ProductCardComponent({ product }) {
  const { productId, productName, price, imageUrl } = product;

  return (
    <article className="group relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-lg">
      <div className="relative">
        <Link href={`/products/${productId}`} className="block">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-50">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition group-hover:scale-[1.03]"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-gradient-to-br from-gray-100 to-violet-50/30 text-gray-300">◇</div>
            )}
          </div>
        </Link>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ButtonAddComponent product={product} />
        </div>
      </div>
      <div className="mt-4">
        <StarRow />
        <Link href={`/products/${productId}`}>
          <h3 className="mt-1 line-clamp-2 text-sm font-bold text-gray-900 hover:text-violet-600">
            {productName}
          </h3>
        </Link>
        <p className="mt-2 text-base font-bold tabular-nums text-gray-900">${price}</p>
      </div>
    </article>
  );
}