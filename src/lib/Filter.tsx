'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Filter( { 
    name, options, param
}: {
    name: string;
    options: string[];
    param: string;
}) {
    const [selected, setSelected] = useState('');
    const dropdownRef = useRef(null);
    const markerRef = useRef(null);

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const createFilterURL = (option: string) => {
        const params = new URLSearchParams(searchParams);
        params.set(param, option);
        return `${pathname}?${params.toString()}`;
    };

    const toggleDropdown = () => {
        const menu: any = dropdownRef.current;
        menu?.classList.toggle('scale-y-100');    
        const marker: any = markerRef.current;
        marker?.classList.toggle('rotate-180');    
    };

    const changeSelected = (option: string) => {
        setSelected(prevOption => {
            const newOption = prevOption === option ? '' : option;
            router.push(createFilterURL(newOption));
            return newOption;
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
                        {name}
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
                { param === 'sort' ? 
                    <div
                        className="filter-dropdown absolute right-0 z-20 mt-2 w-60 max-h-72 origin-top scale-y-0 rounded-md bg-neutral-800 transition overflow-y-auto"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                        tabIndex={-1}
                        ref={dropdownRef}
                    >
                        <div className="py-1">
                            {options.map((option) => (
                                <div key={option} className="flex justify-between px-4 py-2 cursor-pointer" tabIndex={-1} onClick={() => changeSelected(option)}>
                                    {selected === option ? <div className='bg-neutral-700 rounded border border-neutral-600 p-3'/> 
                                        : <div className='rounded border border-neutral-600 p-3'/> }
                                    <span>{option}</span>
                                </div>
                            ))}
                        </div>
                    </div>      
                :  
                    <div
                        className="filter-dropdown absolute left-0 z-20 mt-2 w-60 max-h-72 origin-top scale-y-0 rounded-md bg-neutral-800 transition overflow-y-auto"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                        tabIndex={-1}
                        ref={dropdownRef}
                    >
                        <div className="py-1">
                            {options.map((option) => (
                                <div key={option} className="flex justify-between px-4 py-2 cursor-pointer" tabIndex={-1} onClick={() => changeSelected(option)}>
                                    {selected === option ? <div className='bg-neutral-700 rounded border border-neutral-600 p-3'/> 
                                        : <div className='rounded border border-neutral-600 p-3'/> }
                                    <span>{option}</span>
                                </div>
                            ))}
                        </div>
                    </div>      
                }
            </div>
        </div>
    );
}