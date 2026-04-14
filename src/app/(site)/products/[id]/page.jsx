import ProductDetailClient from "./ProductDetailClient";
import { auth } from "../../../../auth";
import { getProductById } from "../../../service/service";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  return {
    title: `Product Detail | PurelyStore`,
  };
}

export default async function ProductDetailPage({ params }) {
  const session = await auth();
  const { id } = await params;

  const data = await getProductById(id, session?.accessToken);
  const product = data?.payload ?? data;

  if (!product || !product.productId && !product.id) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
