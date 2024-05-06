import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-stone-950 text-zinc-200 px-8 py-6 mt-8">
            <div className="flex">
                <div className="flex gap-4">
                    <Link href="/about">About us</Link>
                    <Link href="/career">Career</Link>
                    <Link href="/contact">Contact</Link>
                </div>
            </div>
        </footer>
    );
}