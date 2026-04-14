import CatalogViewer from "./ProductsClient";
import { getProducts } from "../../service/service";
import { auth } from "../../../auth";

export default async function ProductLanding() {
  const userAuth = await auth();
  const productData = await getProducts(userAuth?.accessToken);
  const productArray = productData?.payload || [];
  const accessDenied = productData?.status === 401 || productData?.status === "401 UNAUTHORIZED";

  if (accessDenied) {
    return (
      <div className="w-full max-w-7xl mx-auto py-32 px-12 bg-gradient-to-br from-crimson-50 via-rose-50 to-amber-100 min-h-screen">
        <div className="max-w-4xl mx-auto text-center py-24 px-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border-4 border-rose-200">
          <div className="w-32 h-32 mx-auto mb-12 bg-gradient-to-br from-rose-500 to-crimson-600 rounded-3xl flex items-center justify-center shadow-2xl">
            <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-crimson-700 via-rose-700 to-amber-700 bg-clip-text text-transparent mb-8 leading-tight">
            Premium Catalog
          </h1>
          <p className="text-2xl text-rose-700 font-bold mb-8 max-w-2xl mx-auto leading-relaxed">
            Authentication required to access the product collection
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-12 border-t-4 border-rose-200">
            <a
              href="/login"
              className="px-12 py-6 rounded-3xl bg-gradient-to-r from-rose-600 to-crimson-700 text-xl font-extrabold text-white shadow-2xl hover:from-rose-700 hover:to-crimson-800 transform hover:scale-105 transition-all duration-300"
            >
              🔐 Sign In Now
            </a>
            <span className="text-lg text-rose-600 font-semibold">or register a new account</span>
          </div>
        </div>
      </div>
    );
  }

  return <CatalogViewer initialProducts={productArray} />;
}