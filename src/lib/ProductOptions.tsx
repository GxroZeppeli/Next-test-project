'use client';

import { useFormState } from "react-dom";
import { addToCart } from "./actions";

type Part = { id: number, type: string, variant: string, amount: number };

export default function ProductOptions({product, parts, types}: 
    { 
        product: { id: number, name: string, image: string, price: string, discountedPrice: string, discount: string }, 
        parts: Part[], 
        types: Set<string> 
    }) {
    const [ state, dispatch ] = useFormState(addToCart, null); 

    return (
        <form className="w-full" action={dispatch}>
            <input type="text" name="id" value={product.id} className="hidden" />
            <h1 className="text-3xl font-bold py-4">{product.name}</h1>
            <p className="text-xl py-4 bg-indigo-600 text-neutral-100 rounded-lg px-4">
                {product.discount ? <><b>{product.discountedPrice}</b> <s>{product.price}</s></>  : <b>{product.price}</b>}
            </p>
            <div>
                {[...types].map((type: string) => (
                    <>
                        <div className="flex gap-4 py-4" key={type}>
                            <p className="text-xl min-w-20 py-4">{type[0].toUpperCase() + type.slice(1)}</p>
                            <div className="w-full">
                                <select name={type} className="w-full text-xl p-4 rounded-lg bg-transparent border border-indigo-600">
                                    <option value={''} className="bg-zinc-800">Select {type} option</option>
                                    {parts.filter((part: Part) => part.type === type).map((part: Part) => (
                                        part.amount === 0 ? 
                                        <option disabled key={part.variant} value={JSON.stringify(part)} className="bg-zinc-800">
                                            {part.variant} ({part.amount})
                                        </option> :
                                        <option key={part.variant} value={JSON.stringify(part)} className="bg-zinc-800">
                                            {part.variant} ({part.amount})
                                        </option>
                                    ))}
                                </select>
                                {state?.errors && state.errors[type] && 
                                state.errors[type].map((error: string) => (
                                    <p className="text-yellow-400 mt-2" key={error}>
                                        {error}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </>
                ))}
            </div>
            <div className="flex gap-4 py-4">
                <p className="text-xl min-w-20 py-4">Quantity</p>
                <div className="w-full">
                    <input
                        type="text"
                        name="quantity"
                        defaultValue={1}
                        className="w-full text-xl p-4 bg-transparent border border-indigo-600 text-center rounded-lg"
                    />
                    {state?.errors?.quantity && 
                        state.errors.quantity.map((error: string) => (
                            <p className="text-yellow-400" key={error}>
                                {error}
                            </p>
                    ))}
                </div>
            </div>
            <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-400 text-lg font-bold transition rounded-lg py-4"
            >
                {state?.message ? state.message : 'Add to cart'}
            </button>
        </form>
    );
}