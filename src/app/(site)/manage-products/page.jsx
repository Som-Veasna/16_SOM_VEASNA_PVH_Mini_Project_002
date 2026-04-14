import ManageProductsClient from "./ManageProductsClient";
import { getProducts, getCategories } from "../../service/service";
import { auth } from "../../../auth";

export default async function ManageProductsPage() {
  const session = await auth();

  const prodData = await getProducts(session?.accessToken);
  const catData = await getCategories(session?.accessToken);

  const productList = prodData?.payload || [];
  const categoryList = catData?.payload || [];

  return (
    <ManageProductsClient
      initialProducts={productList}
      categories={categoryList}
      accessToken={session?.accessToken}
    />
  );
}