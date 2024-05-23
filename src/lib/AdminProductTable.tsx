'use client';

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Entry({id, path, discount, image, name, type, price, brand, discountedPrice, stock}: any) {
    const modal = useRef<HTMLDialogElement | null>(null);
    const [nameState, setNameState] = useState(name);
    const [priceState, setPriceState] = useState(price.slice(1));
    const [priceError, setPriceError] = useState('');
    const [discountState, setDiscountState] = useState(discount);
    const [discountError, setDiscountError] = useState('');
    const [brandState, setBrandState] = useState(brand);
    const [stockState, setStockState] = useState(stock);
    const [typeState, setTypeState] = useState(type);
    const [imageState, setImageState] = useState(image);
    

    const openModal = () => {
        if (modal.current) modal.current.showModal();
    };

    const closeModal = () => {
        if (modal.current) modal.current.close();
    };

    const changePrice = (e: any) => {
        if (isNaN(e.target.value) || Number(e.target.value) < 0) {
            setPriceError('Price must be a positive number');
            return;
        }
        setPriceError('');
        setPriceState(e.target.value);
    };

    const changeDiscount = (e: any) => {
        if (isNaN(e.target.value) || Number(e.target.value) < 0) {
            setDiscountError('Discount must be a positive number');
            return;
        }
        setDiscountError('');
        setDiscountState(e.target.value);
    };

    const setImage = (e: any) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (reader.result) {
                image = reader.result;
                setImageState(reader.result);
            }
        };
    }

    const saveChanges = async () => {
        if (priceError || discountError) return;
        if (!nameState || !priceState || !brandState || !stockState) return;

        const price = Math.floor(Number(priceState) * 100);
        const discount = Math.floor(Number(discountState));
                
        const response = await fetch('/api/admin/product', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id,
                name: nameState,
                type: typeState,
                price,
                discount,
                path: encodeURIComponent(brandState + ' ' + nameState),
                image: imageState,
                oldImage: image,
                brand: brandState,
                stock: stockState
            })
        });
        if (response.ok) {
            closeModal();
            window.location.reload();
        }
    };

    return (
        <div className="flex w-full px-2 md:px-0">
            <div className="aspect-square w-1/6 md:w-1/12 flex flex-col items-center">
                <Link href={'/products/' + path} className='relative w-full aspect-square rounded-xl overflow-hidden'>
                    <Image 
                    className="absolute top-0 left-0 right-0 bottom-0 h-full w-full object-cover"
                    src={image}
                    alt=''
                    width={500}
                    height={250}
                    />
                </Link>
            </div>
            <div className="ml-2 w-5/6 md:w-11/12 flex justify-between pl-2 md:pl-4">
                <Link href={'/products/' + path} className='text-neutral-100 hover:text-neutral-300 uppercase truncate'>{name}</Link>    
                <div className="flex flex-col items-end gap-4">
                    <p>{discount ? <><b>{discountedPrice}</b> <s>{price}</s></>  : <b>{price}</b>}</p>
                    <div className="flex gap-4">
                        <button className="hover:text-neutral-300 transition" onClick={openModal}><PencilIcon className="h-8 w-8" /></button>
                    </div>
                </div>
            </div>
            <dialog ref={modal} className="border-2 border-neutral-600 rounded-lg bg-stone-700 fixed w-11/12 md:w-1/3">

                    <div className="flex flex-col items-center gap-4 bg-stone-700 text-zinc-200 px-8 py-4">
                        <button className="absolute top-1 right-1" onClick={closeModal} aria-label="Close"><XMarkIcon className="h-6 w-6 text-neutral-400 hover:text-neutral-200 transition" /></button>
                        <h2 className="text-xl font-bold">Edit product</h2>
                        <div className="flex gap-2 w-full items-center bg-stone-600 rounded-md">
                            <label htmlFor="name" className="text-neutral-300 font-medium w-1/4 pl-2">Name</label>
                            <input 
                                defaultValue={name}
                                onChange={(e) => setNameState(e.target.value)}
                                type="text" 
                                id="name" 
                                className="w-full border border-neutral-400 text-neutral-200 focus:outline-none focus:border-neutral-200 bg-transparent rounded-md px-2 py-1 transition" 
                            />
                        </div>
                        <div className="flex gap-2 w-full items-center bg-stone-600 rounded-md">
                            <label htmlFor="type" className="text-neutral-300 font-medium w-1/4 pl-2">Type</label>
                            <select 
                                onChange={(e) => setTypeState(e.target.value)}
                                id="type" 
                                defaultValue={type}
                                className="w-full border border-neutral-400 text-neutral-200 focus:outline-none focus:border-neutral-200 bg-transparent rounded-md px-2 py-1 transition"
                            >
                                <option value="switch">Switch</option>
                                <option value="keyboard">Keyboard</option>
                                <option value="mouse">Mouse</option>
                                <option value="keycap">Keycap</option>
                                <option value="mousepad">Mousepad</option>
                            </select>
                        </div>
                        <div className="flex gap-2 w-full items-center bg-stone-600 rounded-md">
                            <label htmlFor="price" className="text-neutral-300 font-medium w-1/4 pl-2">Price</label>
                            <input 
                                defaultValue={price.slice(1)}
                                onChange={changePrice}
                                type="text" 
                                id="price" 
                                className="w-full border border-neutral-400 text-neutral-200 focus:outline-none focus:border-neutral-200 bg-transparent rounded-md px-2 py-1 transition" 
                            />
                        </div>
                        {priceError && <p className="text-red-500">{priceError}</p>}
                        <div className="flex gap-2 w-full items-center bg-stone-600 rounded-md">
                            <label htmlFor="discount" className="text-neutral-300 font-medium w-1/4 pl-2">Discount</label>
                            <input 
                                defaultValue={discount}
                                onChange={changeDiscount}
                                type="text" 
                                id="discount" 
                                className="w-full border border-neutral-400 text-neutral-200 focus:outline-none focus:border-neutral-200 bg-transparent rounded-md px-2 py-1 transition" 
                            />
                        </div>
                        {discountError && <p className="text-red-500">{discountError}</p>}
                        <div className="flex gap-2 w-full items-center bg-stone-600 rounded-md">
                            <label htmlFor="brand" className="text-neutral-300 font-medium w-1/4 pl-2">Brand</label>
                            <input 
                                defaultValue={brand}
                                onChange={(e) => setBrandState(e.target.value)}
                                type="text" 
                                id="brand" 
                                className="w-full border border-neutral-400 text-neutral-200 focus:outline-none focus:border-neutral-200 bg-transparent rounded-md px-2 py-1 transition" 
                            />
                        </div>
                        <div className="flex gap-2 w-full items-center bg-stone-600 rounded-md">
                                <label htmlFor="image" className="text-neutral-300 font-medium w-1/4 pl-2">Main image</label>
                                <input 
                                    type="file"
                                    onChange={(e) => setImage(e)} 
                                    id="image" 
                                    className="w-full border border-neutral-400 text-neutral-200 focus:outline-none focus:border-neutral-200 bg-transparent rounded-md px-2 py-1 transition" 
                                />
                        </div>
                        <div className="flex w-full">
                            <input 
                            type="radio" 
                            onChange={() => setStockState('1')} 
                            name="stock" 
                            id="inStockButton" 
                            className="appearance-none w-1/2 h-8 rounded-l-md bg-stone-600 checked:bg-stone-500 relative after:content-['In-stock'] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-neutral-400 checked:after:text-neutral-200 hover:bg-stone-500 hover:after:text-neutral-200 transition" />
                            <input 
                            type="radio" 
                            onChange={() => setStockState('0')} 
                            name="stock" id="outOfStockButton" 
                            className="appearance-none w-1/2 h-8 rounded-r-md bg-stone-600 checked:bg-stone-500 relative after:content-['Out-of-stock'] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-neutral-400 checked:after:text-neutral-200 hover:bg-stone-500 hover:after:text-neutral-200 transition" />
                        </div>
                        <button className="px-6 py-2 rounded-md w-full bg-stone-600 text-neutral-400 hover:text-neutral-200 transition" onClick={saveChanges}>Save</button>
                    </div>
            </dialog>
        </div>        
    );
}

export function ProductTable({ products }: any) {

    const modal = useRef<HTMLDialogElement | null>(null);

    const [nameState, setNameState] = useState('');
    const [priceState, setPriceState] = useState(0);
    const [priceError, setPriceError] = useState('');
    const [discountState, setDiscountState] = useState(0);
    const [discountError, setDiscountError] = useState('');
    const [brandState, setBrandState] = useState('');
    const [stockState, setStockState] = useState('1');
    const [typeState, setTypeState] = useState('keyboard');
    const [imageState, setImageState] = useState('');
    

    const openModal = () => {
        if (modal.current) modal.current.showModal();
    };

    const closeModal = () => {
        if (modal.current) modal.current.close();
    };

    const changePrice = (e: any) => {
        if (isNaN(e.target.value) || Number(e.target.value) < 0) {
            setPriceError('Price must be a positive number');
            return;
        }
        setPriceError('');
        setPriceState(e.target.value);
    };

    const changeDiscount = (e: any) => {
        if (isNaN(e.target.value) || Number(e.target.value) < 0) {
            setDiscountError('Discount must be a positive number');
            return;
        }
        setDiscountError('');
        setDiscountState(e.target.value);
    };

    const setImage = (e: any) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (reader.result) {
                setImageState(reader.result as string);
            }
        };
    }

    const createProduct = async () => {
        if (priceError || discountError) return;
        if (!nameState || !priceState || !brandState || !stockState) return;

        const price = Math.floor(Number(priceState) * 100);
        const discount = Math.floor(Number(discountState));
                
        const response = await fetch('/api/admin/product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nameState,
                type: typeState,
                price,
                discount,
                path: encodeURIComponent(brandState + ' ' + nameState),
                image: imageState,
                brand: brandState,
                stock: stockState
            })
        });
        if (response.ok) {
            closeModal();
            window.location.reload();
        }
    };

    return (
        <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-center relative mt-4">
            <div className="w-full md:w-1/2 flex flex-col gap-4 items-center">
                <button className="w-fit bg-neutral-800 px-6 py-4 rounded-md font-bold hover:bg-neutral-700 transition" onClick={openModal}>Add product</button>
                <div className="w-full flex flex-col gap-4">
                    {[...Object.values(products)].map((product: any) => (
                        <Entry key={product.id} {...product} />
                    ))}
                </div>
            </div>
            <dialog ref={modal} className="border-2 border-neutral-600 rounded-lg bg-stone-700 fixed w-11/12 md:w-1/3">

                    <div className="flex flex-col items-center gap-4 bg-stone-700 text-zinc-200 px-8 py-4">
                        <button className="absolute top-1 right-1" onClick={closeModal} aria-label="Close"><XMarkIcon className="h-6 w-6 text-neutral-400 hover:text-neutral-200 transition" /></button>
                        <h2 className="text-xl font-bold">Add product</h2>
                        <div className="flex gap-2 w-full items-center bg-stone-600 rounded-md">
                            <label htmlFor="name" className="text-neutral-300 font-medium w-1/4 pl-2">Name</label>
                            <input 
                                onChange={(e) => setNameState(e.target.value)}
                                type="text" 
                                id="name" 
                                className="w-full border border-neutral-400 text-neutral-200 focus:outline-none focus:border-neutral-200 bg-transparent rounded-md px-2 py-1 transition" 
                            />
                        </div>
                        <div className="flex gap-2 w-full items-center bg-stone-600 rounded-md">
                            <label htmlFor="type" className="text-neutral-300 font-medium w-1/4 pl-2">Type</label>
                            <select 
                                onChange={(e) => setTypeState(e.target.value)}
                                id="type" 
                                defaultValue={'keyboard'}
                                className="w-full border border-neutral-400 text-neutral-200 focus:outline-none focus:border-neutral-200 bg-transparent rounded-md px-2 py-1 transition"
                            >
                                <option value="switch">Switch</option>
                                <option value="keyboard">Keyboard</option>
                                <option value="mouse">Mouse</option>
                                <option value="keycap">Keycap</option>
                                <option value="mousepad">Mousepad</option>
                            </select>
                        </div>
                        <div className="flex gap-2 w-full items-center bg-stone-600 rounded-md">
                            <label htmlFor="price" className="text-neutral-300 font-medium w-1/4 pl-2">Price</label>
                            <input 
                                defaultValue={0}
                                onChange={changePrice}
                                type="text" 
                                id="price" 
                                className="w-full border border-neutral-400 text-neutral-200 focus:outline-none focus:border-neutral-200 bg-transparent rounded-md px-2 py-1 transition" 
                            />
                        </div>
                        {priceError && <p className="text-red-500">{priceError}</p>}
                        <div className="flex gap-2 w-full items-center bg-stone-600 rounded-md">
                            <label htmlFor="discount" className="text-neutral-300 font-medium w-1/4 pl-2">Discount</label>
                            <input 
                                defaultValue={0}
                                onChange={changeDiscount}
                                type="text" 
                                id="discount" 
                                className="w-full border border-neutral-400 text-neutral-200 focus:outline-none focus:border-neutral-200 bg-transparent rounded-md px-2 py-1 transition" 
                            />
                        </div>
                        {discountError && <p className="text-red-500">{discountError}</p>}
                        <div className="flex gap-2 w-full items-center bg-stone-600 rounded-md">
                            <label htmlFor="brand" className="text-neutral-300 font-medium w-1/4 pl-2">Brand</label>
                            <input 
                                onChange={(e) => setBrandState(e.target.value)}
                                type="text" 
                                id="brand" 
                                className="w-full border border-neutral-400 text-neutral-200 focus:outline-none focus:border-neutral-200 bg-transparent rounded-md px-2 py-1 transition" 
                            />
                        </div>
                        <div className="flex gap-2 w-full items-center bg-stone-600 rounded-md">
                                <label htmlFor="image" className="text-neutral-300 font-medium w-1/4 pl-2">Main image</label>
                                <input 
                                    type="file"
                                    onChange={(e) => setImage(e)} 
                                    id="image" 
                                    className="w-full border border-neutral-400 text-neutral-200 focus:outline-none focus:border-neutral-200 bg-transparent rounded-md px-2 py-1 transition" 
                                />
                        </div>
                        <div className="flex w-full">
                            <input 
                            type="radio" 
                            onChange={() => setStockState('1')} 
                            name="stock" 
                            id="inStockButton" 
                            className="appearance-none w-1/2 h-8 rounded-l-md bg-stone-600 checked:bg-stone-500 relative after:content-['In-stock'] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-neutral-400 checked:after:text-neutral-200 hover:bg-stone-500 hover:after:text-neutral-200 transition" />
                            <input 
                            type="radio" 
                            onChange={() => setStockState('0')} 
                            name="stock" 
                            id="outOfStockButton" 
                            className="appearance-none w-1/2 h-8 rounded-r-md bg-stone-600 checked:bg-stone-500 relative after:content-['Out-of-stock'] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-neutral-400 checked:after:text-neutral-200 hover:bg-stone-500 hover:after:text-neutral-200 transition" />
                        </div>
                        <button className="px-6 py-2 rounded-md w-full bg-stone-600 text-neutral-400 hover:text-neutral-200 transition" onClick={createProduct}>Create</button>
                    </div>
            </dialog>
        </div>
    );
}