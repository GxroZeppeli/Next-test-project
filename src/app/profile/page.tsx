import { logout } from "@/lib/actions";
import { auth } from "@/../auth";
import Link from "next/link";
import { QueueListIcon } from "@heroicons/react/24/outline";

export default async function Profile() {
    const session = await auth();
    const name = session?.user?.name;
    const email = session?.user?.email;

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold py-4 mt-4">Profile</h1>
            <div className="px-8 py-4 bg-neutral-800 rounded-lg flex flex-col items-center">
                <p className="text-xl font-bold">{name}</p>
                <p className="text-xl">{email}</p>
            </div>
            <Link href="/profile/orders" className="mt-6 bg-neutral-800 px-6 py-4 flex items-center rounded-md font-bold hover:bg-neutral-700 transition">
                <QueueListIcon className="h-5 w-5 mr-2"></QueueListIcon>
                Orders
            </Link>
            <form action={logout}>
                <button className="mt-6 bg-neutral-800 px-6 py-4 w-full flex items-center rounded-md font-bold hover:bg-neutral-700 transition" type="submit">Sign out</button>
            </form>
        </div>
    );
}