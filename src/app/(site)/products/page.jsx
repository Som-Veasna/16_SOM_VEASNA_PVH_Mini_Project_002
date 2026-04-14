import ProductsClient from "./ProductsClient";
import { getProducts } from "../../service/service";
import { auth } from "../../../auth";

export default async function Page() {
  const session = await auth();
  const result = await getProducts(session?.accessToken);
  const items = result?.payload || [];
  const blocked = result?.status === 401 || result?.status === "401 UNAUTHORIZED";

  if (blocked) {
    return (
      <div className="mx-auto w-full max-w-7xl py-10">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">Our Products</h1>
          <p className="text-rose-500">Please sign in to view our product catalog.</p>
        </div>
      </div>
    );
  }

  return <ProductsClient initialProducts={items} />;
}