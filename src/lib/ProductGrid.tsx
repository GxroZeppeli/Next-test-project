import ProductCard from "./ProductCard";
import { fetchKeyboards } from "./data";

export default async function ProductGrid({ 
    products
}: {    
        products: {
            id: number,
            name: string,
            image: string,
            price: string,
            discount: string
        }[]
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 w-full gap-8 py-4">
            {products.map((product: any) => (
                <ProductCard key={product.id} {...product} />
            ))}
        </div>
    );
}