"use client";

import Image from "next/image";
import Link from "next/link";

export default function LandingHeroSectionComponent({ miniProducts }) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 py-14 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-20">
        <div className="max-w-xl">
          <p className="text-sm font-bold uppercase tracking-widest text-violet-500">Premium Beauty</p>
          <h1 className="mt-4 text-5xl font-bold leading-tight tracking-tight text-gray-900">
            Radiance starts with the right routine
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-500">
            Curated formulas for every skin type — discover your glow with products that actually work.
          </p>
          <Link
            href="/products"
            className="mt-10 inline-flex rounded-full bg-violet-600 px-10 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-violet-500"
          >
            Browse Products
          </Link>
        </div>

        <div className="relative lg:min-h-112">
          <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-gray-100 shadow-xl lg:aspect-auto lg:h-[min(36rem,70vh)]">
            <Image
              src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=900&h=1100&fit=crop"
              alt=""
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {miniProducts.length > 0 && (
            <div className="absolute -bottom-4 left-4 right-4 rounded-2xl border border-gray-100 bg-white/95 p-4 shadow-xl backdrop-blur-sm sm:left-auto sm:right-6 sm:w-72 lg:-left-6 lg:bottom-8">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Trending now
              </p>
              <div className="mt-3 flex gap-2">
                {miniProducts.map((p) => (
                  <Link
                    key={p.productId}
                    href={`/products/${p.productId}`}
                    className="relative size-14 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-100"
                  >
                    {p.imageUrl ? (
                      <Image src={p.imageUrl} alt="" fill sizes="56px" className="object-cover" />
                    ) : (
                      <span className="flex size-full items-center justify-center text-xs text-gray-300">◇</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}