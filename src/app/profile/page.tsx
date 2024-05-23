import { logout } from "@/lib/actions";
import { auth } from "@/../auth";
import Link from "next/link";
import { AdjustmentsHorizontalIcon, QueueListIcon } from "@heroicons/react/24/outline";
import { getRole } from "@/lib/data";

export default async function Profile() {
    const session = await auth();
    const name = session?.user?.name;
    const email = session?.user?.email;
    const role = await getRole(email as string);
    const isAdmin = role === 'admin';

    return (
        <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold py-4 mt-4 w-5/6 md:w-1/3">Profile</h1>
            <div className="px-8 py-4 bg-neutral-800 rounded-lg flex flex-col items-center w-5/6 md:w-1/3">
                <p className="text-xl font-bold">{name}</p>
                <p className="text-xl">{email}</p>
            </div>
            <Link href="/profile/orders" className="mt-6 bg-neutral-800 px-6 py-4 flex items-center justify-center rounded-md font-bold hover:bg-neutral-700 transition w-5/6 md:w-1/3">
                <QueueListIcon className="h-5 w-5 mr-2"></QueueListIcon>
                Orders
            </Link>
            {isAdmin &&
                <Link href="/profile/admin" className="mt-6 bg-neutral-800 px-6 py-4 flex items-center justify-center rounded-md font-bold hover:bg-neutral-700 transition w-5/6 md:w-1/3">
                    <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2"></AdjustmentsHorizontalIcon>
                    Admin panel
                </Link>
            }
            <form action={logout} className="w-5/6 md:w-1/3">
                <button className="mt-6 bg-neutral-800 px-6 py-4 w-full flex items-center justify-center rounded-md font-bold hover:bg-neutral-700 transition" type="submit">Sign out</button>
            </form>
        </div>
    );
}