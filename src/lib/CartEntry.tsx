'use client';

import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useRef, useState } from "react";
import { CheckIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Entry({id, path, discount, image, name, price, options, amount, setLoading, setPrice}: any) {
    const [quantity, setQuantity] = useState(amount);
    const [deleted, setDeleted] = useState(false);

    const unitPrice = price;
    const discountedUnitPrice = price - ((price * discount) / 100);
    price = price * quantity;
    const formatedPrice = formatCurrency(price);
    const discountedPrice = formatCurrency(price - ((price * discount) / 100));

    const changeAmount = async (amount: number) => {
        try {
            const responce = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id,
                    amount
                })
            });
            if (!responce.ok) return false;
            const data = await responce.text();
            if (data == 'Not enough stock.') return false;
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const increaseQuantity = async () => {
        setLoading(true);
        const res = await changeAmount(quantity + 1);
        setLoading(false);
        if (res) {
            setPrice((prev: number) => prev + discountedUnitPrice);
            setQuantity((prev: number) => prev + 1);
        }
    };

    const decreaseQuantity = async () => {
        if (quantity > 1) {
            setLoading(true);
            const res = await changeAmount(quantity - 1);
            setLoading(false);
            if (res) {
                setPrice((prev: number) => prev - discountedUnitPrice);
                setQuantity((prev: number) => prev - 1);
            }
        }
    };

    const deleteProduct = async () => {
        try {
            const responce = await fetch('/api/cart', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id
                })
            });
            if (!responce.ok) return false;
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const deleteEntry = async () => {
        setLoading(true);
        const res = await deleteProduct();
        setLoading(false);
        if (res) {
            setPrice((prev: number) => prev - (discountedUnitPrice * quantity));
            setDeleted(true);
        }
    };

    return (
         deleted ? <></> : 
            <div className="flex w-full px-2 md:px-0">
                <div className="aspect-square w-2/6 md:w-1/6 flex flex-col items-center">
                    <Link href={'/products/' + path} className='relative w-full aspect-square rounded-xl overflow-hidden'>
                        {discount &&
                            <div className='absolute top-1 -left-8 bg-teal-500 font-bold px-10 py-1 z-10 -rotate-45'>
                                {discount}%
                            </div>
                        }
                        <Image 
                        className="absolute top-0 left-0 right-0 bottom-0 h-full w-full object-cover"
                        src={image}
                        alt=''
                        width={500}
                        height={250}
                        />
                    </Link>
                </div>
                <div className="ml-2 w-5/6 flex justify-between pl-2 md:pl-4 md:pr-8">
                    <div>
                        <Link href={'/products/' + path} className='text-neutral-100 hover:text-neutral-300 uppercase truncate'>{name}</Link>    
                        <div className="flex gap-2">
                            {options.map((option: any) => (
                                <span key={option} className="text-neutral-400">{option.variant}</span>
                            ))}
                        </div>
                        <div className="flex lg:mt-8 xl:mt-16">
                            <button 
                                className="border border-neutral-400 rounded-l-lg h-8 w-8 xl:h-10 xl:w-10 hover:bg-neutral-700 transition"
                                onClick={decreaseQuantity}
                            >-</button>
                            <span className="border border-neutral-400 h-8 w-8 xl:h-10 xl:w-10 flex items-center justify-center">{quantity}</span>
                            <button 
                                className="border border-neutral-400 rounded-r-lg h-8 w-8 xl:h-10 xl:w-10 hover:bg-neutral-700 transition"
                                onClick={increaseQuantity}
                            >+</button>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                        <p>{discount ? <><b>{discountedPrice}</b> <s>{formatedPrice}</s></>  : <b>{formatedPrice}</b>}</p>
                        <button className="hover:text-neutral-300 transition" onClick={deleteEntry}><TrashIcon className="h-8 w-8" /></button>
                    </div>
                </div>
            </div>        
    );
}

export function CartContent({ cart, session }: any) {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState(cart);
    const [modalState, setModalState] = useState(0); // 1: success, 2: out of stock, 3: error
    
    let totalPrice = 0;
    [...Object.values(cart)].forEach((product: any) => {
        totalPrice += (product.price - ((product.price * product.discount) / 100)) * product.amount;
    });

    const [price, setPrice] = useState(totalPrice);

    const modal = useRef<HTMLDialogElement | null>(null);
    const closeModal = () => {
        setModalState(0);
        if (modal.current) modal.current.close();
    };

    const placeOrder = async () => {
        if (session?.user?.email) {
            setLoading(true);
            const email = session?.user?.email;
            const res = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email
                })
            });
            if (!res.ok) {
                setLoading(false);
                setModalState(3);
                if (modal.current) modal.current.showModal();
                return; 
            }
            const data = await res.text();
            if (data == 'Not enough stock.') {
                setLoading(false);
                setModalState(2);
                if (modal.current) modal.current.showModal();
                return; 
            }
            else {
                setProducts({});
                setPrice(0);
                setLoading(false);
                setModalState(1);
                if (modal.current) modal.current.showModal();
                return;
            }
        }
    };

    return (
        <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-center relative mt-4">
            <div className="w-full md:w-1/2 flex flex-col gap-4">
                {[...Object.values(products)].map((product: any) => (
                    <Entry key={product.id} {...product} setLoading={setLoading} setPrice={setPrice} />
                ))}
            </div>
            <div className="w-5/6 md:w-1/6 h-40 rounded-lg border-2 border-neutral-600 py-4 px-8 mt-8 md:mt-0">
                <div className="flex justify-between">
                    <h2 className="text-xl font-bold">Total</h2>
                    <h2 className="text-xl font-bold">{formatCurrency(price)}</h2>
                </div>
                { loading || price === 0 ? 
                <button 
                    className="disabled w-full py-4 mt-8 rounded-lg flex items-center justify-center bg-neutral-700 text-neutral-100 hover:text-neutral-300 uppercase transition"
                >Checkout</button>
                :
                <button 
                    className="w-full py-4 mt-8 rounded-lg flex items-center justify-center bg-indigo-600 text-neutral-100 hover:text-neutral-300 uppercase transition"
                    onClick={placeOrder}
                >Checkout</button>
                }
            </div>
            <dialog ref={modal} className="border-2 border-neutral-600 rounded-lg bg-stone-700">
                { modalState === 1 
                    ? 
                    <div className="flex flex-col items-center gap-4 bg-stone-700 text-zinc-200 px-8 py-4">
                        <CheckIcon className="h-8 w-8 text-emerald-500" />
                        <h2 className="text-xl font-bold">Order placed!</h2>
                        <Link href="/profile/orders" className="text-neutral-400 hover:text-neutral-200 transition">View your orders</Link>
                        <button className="px-6 py-2 rounded-md w-full bg-stone-600 text-neutral-400 hover:text-neutral-200 transition" onClick={closeModal}>Close</button>
                    </div>
                    :
                    modalState === 2 
                    ? 
                    <div className="flex flex-col items-center gap-4 bg-stone-700 text-zinc-200 px-8 py-4">
                        <XMarkIcon className="h-8 w-8 text-rose-500" />
                        <h2 className="text-xl font-bold">Not enough stock</h2>
                        <button className="px-6 py-2 rounded-md w-full bg-stone-600 text-neutral-400 hover:text-neutral-200 transition" onClick={closeModal}>Close</button>
                    </div>
                    :
                    <div className="flex flex-col items-center gap-4 bg-stone-700 text-zinc-200 px-8 py-4">
                        <XMarkIcon className="h-8 w-8 text-rose-500" />
                        <h2 className="text-xl font-bold">Something went wrong</h2>
                        <button className="px-6 py-2 rounded-md w-full bg-stone-600 text-neutral-400 hover:text-neutral-200 transition" onClick={closeModal}>Close</button>
                    </div>
                }
            </dialog>
        </div>
    );
}