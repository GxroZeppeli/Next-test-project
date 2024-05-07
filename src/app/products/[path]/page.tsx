import { fetchProductImages, fetchProductPage, fetchProductQuantities } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from 'next/image';
import ProductOptions from "@/lib/ProductOptions";
import TableEntry from "@/lib/TableEntry";

export default async function Page({ params }: { params: { path: string } }) {
    let product: any;
    try {
        product = await fetchProductPage(params.path);
        
    } catch (error) {
        notFound();
    }
    const images = await fetchProductImages(product.id);
    images.unshift(product.image);
    const parts = await fetchProductQuantities(product.id);
    const types = new Set(parts.map((part) => part.type));

    return (
        <div className="flex justify-center">
            <div className="w-full md:w-10/12 md:columns-2 gap-8 md:px-8 pt-4">
                <div className="w-full flex overflow-x-auto min-h-60 md:grid grid-cols-2 gap-4 break-inside-avoid px-8 md:px-0 snap-x">
                    {images.map((image, index) => 
                        index === 0 ? (
                        <Image
                            className="rounded-xl aspect-square md:w-full md:h-full object-cover col-span-2 row-span-2 snap-center"
                            src={image}
                            alt=''
                            width={1000}
                            height={1000}
                            key={image}
                        />
                        ) : (
                            <Image
                                className="rounded-xl aspect-square md:w-full md:h-full object-cover snap-center"
                                src={image}
                                alt=''
                                width={500}
                                height={500}
                                key={image}
                            />
                        )
                    )}
                </div>
                <div className="break-inside-avoid px-8 md:px-0">
                    <ProductOptions product={product} parts={parts} types={types}/>
                    <p className="text-xl py-4">{product.description}</p>
                    <table className="w-full">
                        <tbody>
                            <TableEntry title="Brand" value={product.brand}></TableEntry>
                            <TableEntry title="Status" value={product.status}></TableEntry>
                            <TableEntry title="Layout" value={product.layout}></TableEntry>
                            <TableEntry title="Structure" value={product.structure}></TableEntry>
                            <TableEntry title="Material" value={product.material}></TableEntry>
                            <TableEntry title="Weight" value={product.weight}></TableEntry>
                            <TableEntry title="Colors" value={product.colors}></TableEntry>
                            <TableEntry title="PCB" value={product.pcb}></TableEntry>
                            <TableEntry title="Plate" value={product.plate}></TableEntry>
                            <TableEntry title="Manufacturer" value={product.manufacturer}></TableEntry>
                            <TableEntry title="Profile" value={product.profile}></TableEntry>
                            <TableEntry title="Production type" value={product.production}></TableEntry>
                            <TableEntry title="Switch type" value={product.switch_type}></TableEntry>
                            <TableEntry title="Operation force" value={product.operation_force}></TableEntry>
                            <TableEntry title="Durability" value={product.durability}></TableEntry>
                            <TableEntry title="Spring" value={product.spring}></TableEntry>
                            <TableEntry title="Package" value={product.package}></TableEntry>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}