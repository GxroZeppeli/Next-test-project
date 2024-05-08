import { auth } from "@/../auth";
import Link from "next/link";
import Image from "next/image";
import { getOrders } from "@/lib/data";
import Refresh from "@/lib/Refresh";

export default async function Orders() {
    const session = await auth();
    const orders = await getOrders(session?.user?.email as string);

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold py-4 mt-4">Orders</h1>
            <div className="w-full px-2 md:px-8 flex flex-col gap-4">
                {orders.map((order: any) => (
                    <div key={order.id} className="w-full py-4 px-6 border-b border-neutral-700 bg-neutral-800 rounded-lg">
                        <div className="flex gap-4 justify-between">
                            <span>id: {order.id}</span>
                            <span className="text-end">Status: {order.status}</span>
                        </div>
                        <div className="flex gap-4 justify-between">
                            <span>{order.date}</span>
                            <span>{order.price}</span>
                        </div>
                        <div className="flex gap-4 overflow-x-auto mt-4">
                            {order.products.map((product: any) => (
                                <div key={product.name} className="flex">
                                    <Link href={`/products/${product.path}`}>
                                        <div className="flex gap-2 flex-col items-center">
                                            <Image
                                                className="rounded-xl aspect-square min-w-32 max-w-32 object-cover"   
                                                src={product.image}
                                                alt=''
                                                width={200}
                                                height={200}
                                            />
                                            <span>{product.name}</span>
                                            <span>Amount: {product.amount}</span>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <Refresh></Refresh>
        </div>
    );
}