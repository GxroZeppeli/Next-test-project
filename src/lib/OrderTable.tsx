'use client';

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function OrderTable({orders}: {orders: any[]}) {
    return (
        <div className="w-full flex flex-col gap-4 items-center px-2 md:px-0">
            {orders.map((order: any) => (
                <OrderEntry key={order.id} {...order} />
            ))}
            {orders.length === 0 && <div className="w-full md:w-1/2 py-4 px-6 bg-neutral-700 rounded-lg text-center">No orders</div>}
        </div>
    );
}

export function OrderEntry({id, email, date, price, status, details, products}: {id: string, email: string, date: string, price: string, status: string, details: string, products: any[]}) {
    const modal = useRef<HTMLDialogElement | null>(null);
    const openModal = () => {
        if (modal.current) modal.current.showModal();
    };

    const closeModal = () => {
        if (modal.current) modal.current.close();
    };

    const [detailsState, setDetails] = useState(details);
    const [statusState, setStatus] = useState(status);

    const updateOrder = async () => {
        const responce = await fetch('/api/admin/order', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id,
                status: statusState,
                details: detailsState
            })
        });
        if (responce.ok) {
            closeModal();
            window.location.reload();
        }
    };

    return (
        <div key={id} className="w-full md:w-1/2 py-4 px-6 border-b border-neutral-700 bg-neutral-800 rounded-lg">
            <div className="flex gap-4 justify-between">
                <div className="flex flex-col">
                    <span>id: {id}</span>
                    <span>Email: {email}</span>
                    <span>{date}</span>
                    <span>{price}</span>
                    <span>Status: {status}</span>
                    {details && <span>Details: {details}</span>}
                </div>
                <button onClick={openModal} className="w-12 h-12 p-2 rounded-md bg-neutral-600 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 transition flex items-center justify-center"><PencilIcon className="h-6 w-6"></PencilIcon></button>
            </div>
            <div className="flex gap-4 overflow-x-auto mt-4">
                {products.map((product: any) => (
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

            <dialog ref={modal} className="border-2 border-neutral-600 rounded-lg bg-stone-700 w-11/12 md:w-1/3 fixed">

                    <div className="flex flex-col items-center gap-4 bg-stone-700 text-zinc-200 px-8 py-4">
                        <button className="absolute top-1 right-1" onClick={closeModal} aria-label="Close"><XMarkIcon className="h-6 w-6 text-neutral-400 hover:text-neutral-200 transition" /></button>
                        <h2 className="text-xl font-bold">Update Order</h2>
                        <div className="flex gap-2 w-full items-center bg-stone-600 rounded-md">
                            <label htmlFor="name" className="text-neutral-300 font-medium w-1/4 pl-2">Details</label>
                            <input 
                                onChange={(e) => setDetails(e.target.value)}
                                defaultValue={detailsState}
                                type="text" 
                                id="name" 
                                className="w-full border border-neutral-400 text-neutral-200 focus:outline-none focus:border-neutral-200 bg-transparent rounded-md px-2 py-1 transition" 
                            />
                        </div>
                        <div className="flex gap-2 w-full items-center bg-stone-600 rounded-md">
                            <label htmlFor="type" className="text-neutral-300 font-medium w-1/4 pl-2">Type</label>
                            <select 
                                onChange={(e) => setStatus(e.target.value)}
                                id="type" 
                                defaultValue={statusState}
                                className="w-full border border-neutral-400 text-neutral-200 focus:outline-none focus:border-neutral-200 bg-transparent rounded-md px-2 py-1 transition"
                            >
                                <option value="Created">Created</option>
                                <option value="Assembly">Assembly</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Problem">Problem</option>
                                <option value="Fulfilled">Fullfilled</option>
                            </select>
                        </div>
                        <button className="px-6 py-2 rounded-md w-full bg-stone-600 text-neutral-400 hover:text-neutral-200 transition" onClick={updateOrder}>Update</button>
                    </div>
            </dialog>

        </div>
    );
}