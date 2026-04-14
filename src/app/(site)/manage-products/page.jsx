import ManageProductsClient from "./ManageProductsClient";
import { getProducts, getCategories } from "../../service/service";
import { auth } from "../../../auth";

export default async function ManageProductsPage() {
  const session = await auth();

  const productsData = await getProducts(session?.accessToken);
  const categoriesData = await getCategories(session?.accessToken);
  
  const products = productsData?.payload || [];
  const categories = categoriesData?.payload || [];

  return (
    <ManageProductsClient 
      initialProducts={products} 
      categories={categories}
      accessToken={session?.accessToken}
    />
  );
}
