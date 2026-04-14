import ProductDetailClient from "./ProductDetailClient";
import { auth } from "../../../../auth";
import { getProductById } from "../../../service/service";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  return { title: "Product | BloomShop" };
}

export default async function ProductDetailPage({ params }) {
  const session = await auth();
  const { id } = await params;

  const data = await getProductById(id, session?.accessToken);
  const item = data?.payload ?? data;

  if (!item || (!item.productId && !item.id)) {
    notFound();
  }

  return <ProductDetailClient product={item} />;
}