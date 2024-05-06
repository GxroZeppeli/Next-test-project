import Slideshow from "@/lib/Slideshow";
import CategoryCard from "@/lib/CategoryCard";
import ProductCard from "@/lib/ProductCard";
import Link from "next/link";
import { fetchLatestProducts, fetchSlides } from "@/lib/data";


export default async function Home() {
  // fetch slides on server
  const slides = await fetchSlides();
  const products = await fetchLatestProducts('');
  const keyboards = await fetchLatestProducts('keyboard');
  const keycaps = await fetchLatestProducts('keycap');
  const switches = await fetchLatestProducts('switch');

  return (
    <main>
      <Slideshow slides={slides} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-8 pt-16">
        <CategoryCard category={'Keyboards'} link={'/keyboards'} image={'/holy1.png'} />
        <CategoryCard category={'Keycaps'} link={'/keycaps'} image={'/keycaps.png'} />
        <CategoryCard category={'Mice'} link={'/mice'} image={'/mice.png'} />
      </div>
      <div className="flex flex-col items-center pt-8">
        <h3 className="text-3xl font-bold pb-2">New Products</h3>
        <Link href="/products" className="text-neutral-400 hover:text-neutral-200 transition mb-4">Shop now</Link>
        <div className="grid grid-cols-[repeat(5,_60vw)] md:grid-cols-5 w-full gap-8 md:gap-4 overflow-auto px-8 snap-x">
            {products.map((product) => (
                <ProductCard key={product.id} {...product} />
            ))}
        </div>
      </div>
      <div className="flex flex-col items-center pt-12">
        <h3 className="text-3xl font-bold pb-2">Keyboards</h3>
        <Link href="/keyboards" className="text-neutral-400 hover:text-neutral-200 transition mb-4">Shop now</Link>
        <div className="grid grid-cols-[repeat(5,_60vw)] md:grid-cols-5 w-full gap-8 md:gap-4 overflow-auto px-8 snap-x">
            {keyboards.map((product) => ( 
                <ProductCard key={product.id} {...product} />
            ))}
        </div>
      </div>
      <div className="flex flex-col items-center pt-12">
        <h3 className="text-3xl font-bold pb-2">Keycaps</h3>
        <Link href="/keycaps" className="text-neutral-400 hover:text-neutral-200 transition mb-4">Shop now</Link>
        <div className="grid grid-cols-[repeat(5,_60vw)] md:grid-cols-5 w-full gap-8 md:gap-4 overflow-auto px-8 snap-x">
            {keycaps.map((product) => (
                <ProductCard key={product.id} {...product} />
            ))}
        </div>
      </div>
      <div className="flex flex-col items-center pt-12">
        <h3 className="text-3xl font-bold pb-2">Keyboard switches</h3>
        <Link href="/switches" className="text-neutral-400 hover:text-neutral-200 transition mb-4">Shop now</Link>
        <div className="grid grid-cols-[repeat(5,_60vw)] md:grid-cols-5 w-full gap-8 md:gap-4 overflow-auto px-8 snap-x">
            {switches.map((product) => ( 
                <ProductCard key={product.id} {...product} />
            ))}
        </div>
      </div>
    </main>
  );
}


