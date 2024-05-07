import { getCartContent } from "@/lib/data";
import { auth } from "../../../auth";
import { CartContent } from "@/lib/CartEntry";
import Refresh from "@/lib/Refresh";

export default async function Cart() {
    const session = await auth();
    const cart = await getCartContent(session?.user?.email as string);

    return (
        <div className="flex items-center py-8 flex-col gap-4">
            <h1 className="text-3xl font-bold">Product cart</h1>
            <CartContent cart={cart} session={session} />
            <Refresh></Refresh>
        </div>
    );
}
