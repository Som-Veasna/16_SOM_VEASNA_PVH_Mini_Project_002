import Link from "next/link";
import { auth } from "../../auth";
import { loadProducts } from "../service/service";
import { categories, products as staticProducts } from "../../data/mockData";
import LandingHeroSectionComponent from "../../components/landing/LandingHeroSectionComponent";
import LandingBestSellerSectionComponent from "../../components/landing/LandingBestSellerSectionComponent";
import LandingEssentialComponent from "../../components/landing/LandingEssentialComponent";

export default async function Home() {
  const session = await auth();
  const signedIn = !!session?.user;

  let liveProducts = [];
  if (signedIn) {
    try {
      const fetched = await getProducts(session?.accessToken);
      liveProducts = fetched?.payload || [];
    } catch (err) {
      console.error("Product fetch failed:", err);
    }
  }

  const allProducts = signedIn && liveProducts.length > 0 ? liveProducts : staticProducts;
  const topFour = allProducts.slice(0, 4);
  const heroThree = allProducts.slice(0, 3);

  return (
    <div className="bg-white">
      <LandingHeroSectionComponent miniProducts={signedIn ? heroThree : []} />

      {signedIn ? (
        <>
          <LandingBestSellerSectionComponent items={topFour} />
          <LandingEssentialComponent products={allProducts} />
        </>
      ) : (
        <section className="mx-auto w-full max-w-7xl py-16">
          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Sign in to see our full catalog</h2>
            <p className="mt-2 text-gray-400">Create an account or log in to browse all products.</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link href="/login" className="rounded-full px-6 py-3 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 hover:bg-gray-100">
                Log in
              </Link>
              <Link href="/register" className="rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-500">
                Register
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto w-full max-w-7xl py-16">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <p className="text-5xl font-bold tabular-nums text-gray-900">1,200+</p>
            <p className="mt-2 font-medium text-gray-500">Beauty formulas in our demo catalog</p>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-violet-600 p-8 text-white shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wider opacity-80">Spotlight</p>
            <p className="mt-4 text-2xl font-bold leading-snug">No. 1 starter routine pick</p>
            <p className="mt-2 text-sm opacity-80">Student UI — swap for your real campaign.</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-violet-50 p-8 shadow-sm">
            <p className="text-5xl font-bold tabular-nums text-gray-900">20+</p>
            <p className="mt-2 font-medium text-gray-700">Countries in mock order data</p>
          </div>
        </div>
      </section>

      <section id="about" className="border-y border-gray-100 bg-gray-50 py-16">
        <div className="mx-auto w-full max-w-7xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">Why BloomShop?</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Fully transparent", d: "Mock data only — no hidden APIs in this build." },
              { t: "Clean UX", d: "Clear buttons, readable type, and calm spacing throughout." },
              { t: "Traceable code", d: "Components you can follow from page to context." },
              { t: "Ship-ready", d: "Filters, cart, and routes mirror real storefront patterns." },
            ].map((card) => (
              <div key={card.t} className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-base font-bold text-gray-900">{card.t}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{card.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-violet-700 py-16">
        <div className="mx-auto w-full max-w-7xl text-center">
          <h2 className="text-4xl font-bold leading-tight text-white">
            Start your glow-up with our natural skincare collection
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-violet-200">
            Connect this banner to your real promo or newsletter when you are ready to ship.
          </p>
          <Link
            href="/products"
            className="mt-10 inline-flex rounded-full bg-white px-10 py-4 text-sm font-bold text-violet-700 transition hover:bg-violet-50"
          >
            Shop now
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl py-12 text-center text-sm text-gray-400">
        <p>
          Explore{" "}
          <Link href="/categories" className="font-semibold text-gray-900 underline-offset-2 hover:underline">
            {categories.length} categories
          </Link>{" "}
          and{" "}
          <Link href="/order" className="font-semibold text-gray-900 underline-offset-2 hover:underline">
            sample orders
          </Link>{" "}
          from the same project.
        </p>
      </section>
    </div>
  );
}