import { auth } from "@/../auth";
import { ProductTable } from "@/lib/AdminProductTable";
import OrderTable from "@/lib/OrderTable";
import Pagination from "@/lib/Pagination";
import { fetchProductAmount, fetchProducts, getAllOrders, getOrderAmount, getRole } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function Page(params: { searchParams: { productPage?: string, userPage?: string, orderPage?: string } }) {
    const session = await auth();
    const role = await getRole(session?.user?.email as string);
    if (role !== 'admin') notFound();

    const productQuery = {
        stock: '',
        brand: '',
        sort: 'Date: Newest', 
        priceGreater: 0,
        priceLess: 1000000,
        page: Number(params?.searchParams?.productPage) || 1,
        ITEMS_PER_PAGE: 6
    };
    
    const products = await fetchProducts(productQuery);
    const productPages = +await fetchProductAmount(productQuery) || 1;

    const orders = await getAllOrders(Number(params?.searchParams?.orderPage) || 1, 4);
    const orderPages = +await getOrderAmount(4) || 1;

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold py-4 mt-4">Products</h2>
            <ProductTable products={products}></ProductTable>
            <Pagination totalPages={productPages} paramName="productPage" />
            <h2 className="text-3xl font-bold py-4 mt-4">Orders</h2>
            <OrderTable orders={orders}></OrderTable>
            <Pagination totalPages={orderPages} paramName="orderPage" />
        </div>
    );
}

