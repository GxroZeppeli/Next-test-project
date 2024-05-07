'use client';

import Link from "next/link";
import { MagnifyingGlassIcon, UserIcon, ShoppingBagIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { useRef } from "react";

export default function Header({ session }: { session: any }) {

    const showDropdown = (elem: HTMLElement) => {
        const dropdown = elem.querySelector('.dropdown');
        dropdown?.classList.add('max-h-96');
    }

    const hideDropdown = (elem: HTMLElement) => {
        const dropdown = elem.querySelector('.dropdown');
        dropdown?.classList.remove('max-h-96');
    }

    const toggleMenu = (elem: HTMLElement) => {
        const menu = elem.querySelector('.menu');
        menu?.classList.toggle('h-screen');
    }
    
    const moreRef = useRef(null);
    const showMore = () => showDropdown(moreRef.current as unknown as HTMLElement);
    const hideMore = () => hideDropdown(moreRef.current as unknown as HTMLElement);
    const userRef = useRef(null);
    const showUser = () => showDropdown(userRef.current as unknown as HTMLElement);
    const hideUser = () => hideDropdown(userRef.current as unknown as HTMLElement);
    const burgerRef = useRef(null);
    const toggleBurger = () => toggleMenu((burgerRef.current as unknown as HTMLElement).parentElement as HTMLElement);

    return (
        <header className="sticky left-0 top-0 right-0 w-full bg-stone-950 text-zinc-200 z-50">
            <div className="justify-between hidden md:flex px-8">
                <ol className="flex gap-4 text-lg font-bold">
                    <li className="py-4">
                        <Link href="/">Home</Link>
                    </li>
                    <li className="py-4">
                        <Link href="/keyboards">Keyboards</Link>
                    </li>
                    <li className="py-4">
                        <Link href="/mousepads">Mousepads</Link>
                    </li>
                    <li className="py-4">
                        <Link href="/mice">Mice</Link>
                    </li>
                    <li className="py-4">
                        <Link href="/switches">Switches</Link>
                    </li>
                    <li className="py-4">
                        <Link href="/Keycaps">Keycaps</Link>
                    </li>
                    <li className="relative py-4 pr-5" ref={moreRef} onMouseEnter={showMore} onMouseLeave={hideMore}>
                        <span>More</span>
                        <div className="dropdown absolute -left-4 top-14 bg-stone-950 max-h-0 transition-all duration-500 ease-in-out overflow-hidden" >
                            <ol className="flex flex-col gap-4 text-lg font-bold px-4 py-2">
                                <li>
                                    <Link href="/plates">Plates</Link>
                                </li>
                                <li>
                                    <Link href="/cases">Cases</Link>
                                </li>
                                <li>
                                    <Link href="/pcbs">PCBs</Link>
                                </li>
                                <li>
                                    <Link href="/accesories">Accesories</Link>
                                </li>
                            </ol>
                        </div>
                        <svg className="w-4 h-4 absolute right-0 bottom-5" xmlns="http://www.w3.org/2000/svg" 
                            fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </li>
                </ol>
                <div className="flex gap-4 py-4">
                    {/* <MagnifyingGlassIcon className="w-6 h-6" /> */}
                    <div className="relative" ref={userRef} onMouseEnter={showUser} onMouseLeave={hideUser}>
                        <UserIcon className="w-6 h-6" />
                        { session == null ?
                        <div className="dropdown absolute w-40 -right-16 top-10 bg-stone-950 max-h-0 transition-all duration-500 ease-in-out overflow-hidden" >
                            <ol className="flex flex-col gap-4 text-lg font-bold px-4 py-2">
                                <li>
                                    <Link href="/login">Log in</Link>
                                </li>
                                <li>
                                    <Link href="/register">Create an account</Link>
                                </li>
                            </ol>
                        </div>
                        :
                        <div className="dropdown absolute w-40 -right-16 top-10 bg-stone-950 max-h-0 transition-all duration-500 ease-in-out overflow-hidden" >
                            <ol className="flex flex-col gap-4 text-lg font-bold px-4 py-2">
                                <li>
                                    <Link href="/profile">Profile</Link>
                                </li>
                            </ol>
                        </div>
                        }
                    </div>
                    <Link href="/cart"><ShoppingBagIcon className="w-6 h-6" /></Link>
                </div>
            </div>
            <div className="justify-between flex md:hidden py-4 px-8 bg-stone-950 relative">
                <Bars3Icon className="w-6 h-6" onClick={toggleBurger} ref={burgerRef} />
                <div className="menu absolute left-0 top-[100%] right-0 h-0 bg-stone-800 transition-all duration-500 ease-in-out overflow-hidden">
                    <ol className="flex flex-col gap-4 text-lg font-bold px-4 py-2">
                        <li>
                            <Link href="/">Home</Link>
                        </li>
                        <li>
                            <Link href="/keyboards">Keyboards</Link>
                        </li>
                        <li>
                            <Link href="/mousepads">Mousepads</Link>
                        </li>
                        <li>
                            <Link href="/mice">Mice</Link>
                        </li>
                        <li>
                            <Link href="/switches">Switches</Link>
                        </li>
                        <li>
                            <Link href="/Keycaps">Keycaps</Link>
                        </li>
                        <li>
                            <Link href="/plates">Plates</Link>
                        </li>
                        <li>
                            <Link href="/cases">Cases</Link>
                        </li>
                        <li>
                            <Link href="/pcbs">PCBs</Link>
                        </li>
                        <li>
                            <Link href="/accesories">Accesories</Link>
                        </li>
                    </ol>
                </div>
                <div className="flex gap-4">
                    {/* <MagnifyingGlassIcon className="w-6 h-6" /> */}
                    <Link href="/profile"><UserIcon className="w-6 h-6" /></Link>
                    <Link href="/cart"><ShoppingBagIcon className="w-6 h-6" /></Link>
                </div>
            </div>
        </header>
    );
}

export function BrandLogo() {
    return (
        <div className="h-16 flex justify-center items-center bg-stone-950 text-zinc-200">
            <Link href="/">
                <h1 className="text-3xl font-bold">Endgame Gear</h1>
            </Link>
        </div>
    );
}