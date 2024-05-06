'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { debounce } from './utils';

export default function PriceFilter( { 
    limit
}: {
    limit: number;
}) {
    const [lowerLimit, setLowerLimit] = useState(0);
    const [upperLimit, setUpperLimit] = useState(limit);
    const dropdownRef = useRef(null);
    const markerRef = useRef(null);

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const createFilterURL = (lower: number, upper: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('priceGreater', lower.toString());
        params.set('priceLess', upper.toString());
        return `${pathname}?${params.toString()}`;
    };

    const toggleDropdown = () => {
        const menu: any = dropdownRef.current;
        menu?.classList.toggle('scale-y-100');    
        const marker: any = markerRef.current;
        marker?.classList.toggle('rotate-180');    
    };

    const debouncedRouter = useRef(
        debounce((url: string) => {
            router.push(url);
        }, 500)
    ).current;

    const changeUpper = (price: number) => {
        setUpperLimit(() => {
            const newLimit = price < limit ? price : limit;
            debouncedRouter(createFilterURL(lowerLimit, newLimit));
            return newLimit;
        });
    };

    const changeLower = (price: number) => {
        setLowerLimit(() => {
            const newLimit = price > 0 ? price : 0;
            debouncedRouter(createFilterURL(newLimit, upperLimit));
            return newLimit;
        });
    };

    useEffect(() => {
        const func = (event: any) => {
            const menu: any = dropdownRef.current;
            const marker: any = markerRef.current;
            if(event.target.closest('.filter') !== menu.closest('.filter')) {
                menu?.classList.remove('scale-y-100');
                marker?.classList.remove('rotate-180');
            }
        };
        document.addEventListener('click', func);
        return () => document.removeEventListener('click', func);
    }, []);

    return (
        <div className='filter w-40'>
            <div className="relative text-left">
                <div>
                    <button
                        type="button"
                        className="flex w-full justify-between rounded-md px-4 py-2 font-medium hover:bg-neutral-800 border border-neutral-700"
                        id="menu-button"
                        aria-expanded="true"
                        aria-haspopup="true"
                        onClick={toggleDropdown}
                    >
                        Price
                        <svg
                            className="-mr-1 ml-2 h-5 w-5 transition rotate-0" 
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            ref={markerRef}
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
                <div
                    className="dropdown absolute left-0 z-20 mt-2 w-56 origin-top scale-y-0 rounded-md bg-neutral-800 transition"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    tabIndex={-1}
                    ref={dropdownRef}
                >
                    <div className="p-2">
                        <div className="flex items-center gap-2 pb-2">
                            <span>Min</span>
                            <input
                                type="range"
                                min="0"
                                max={limit}
                                value={lowerLimit}
                                onChange={(e: any) => changeLower(e.target.value)}
                                className="w-full appearance-none bg-stone-700 h-1.5 rounded-lg"
                            />
                            <input
                                type="text"
                                min="0"
                                max={limit}
                                value={lowerLimit}
                                onChange={(e: any) => parseInt(e.target.value) && changeLower(e.target.value)}
                                className="w-16 bg-transparent border border-neutral-700 text-center rounded"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Max</span>
                            <input
                                type="range"
                                min="0"
                                max={limit}
                                value={upperLimit}
                                onChange={(e: any) => changeUpper(e.target.value)}
                                className="w-full appearance-none bg-stone-700 h-1.5 rounded-lg"
                            />
                            <input
                                type="text"
                                min="0"
                                max={limit}
                                value={upperLimit}
                                onChange={(e: any) => parseInt(e.target.value) && changeUpper(e.target.value)}
                                className="w-16 bg-transparent border border-neutral-700 text-center rounded"
                            />
                        </div>
                    </div>
                </div>      
            </div>
        </div>
    );
}