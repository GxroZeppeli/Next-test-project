import { fetchBrands, fetchKeycapAmount, fetchKeycaps, fetchMaxPrice, fetchProfiles } from "@/lib/data";
import Filter from "@/lib/Filter";
import Pagination from "@/lib/Pagination";
import PriceFilter from "@/lib/PriceFilter";
import ProductGrid from "@/lib/ProductGrid";

export default async function Page({ 
    searchParams 
}: {
        searchParams?: { 
            stock?: string,
            profile?: string,
            brand?: string, 
            page?: number,
            sort?: string,
            priceGreater?: number,
            priceLess?: number
        };
}) {
    const profiles = await fetchProfiles();
    const brands = await fetchBrands('keycap');
    const priceLimit = await fetchMaxPrice('keycap');
    const currentPage = Number(searchParams?.page) || 1;
    const query = {
        stock: searchParams?.stock === 'In Stock' ? '1' : searchParams?.stock === 'Out of Stock' ? '0' : '1',
        profile: searchParams?.profile || '',
        brand: searchParams?.brand || '',
        sort: searchParams?.sort || 'Date: Newest', 
        priceGreater: searchParams?.priceGreater || 0,
        priceLess: searchParams?.priceLess || priceLimit,
        page: currentPage
    };
    const totalPages = +await fetchKeycapAmount(query) || 1;
    const products = await fetchKeycaps(query);

    return (
        <div className="px-8">
            <h1 className="text-3xl font-bold py-6 text-center">Keycaps</h1>
            <div className="flex justify-between py-4">
                <div className="flex flex-wrap gap-2">
                    <Filter name="Profile" options={profiles} param="profile" />
                    <Filter name="Brand" options={brands} param="brand" />
                    <Filter name="Availability" options={['In Stock', 'Out of Stock']} param="stock" />
                    <PriceFilter limit={priceLimit} />
                </div>
                <Filter name="Sort by" options={['Price: Low to High', 'Price: High to Low', 'Date: Newest', 'Date: Oldest', 'Title: A-Z', 'Title: Z-A']} param="sort" />
            </div>
            <ProductGrid products={products} />
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}