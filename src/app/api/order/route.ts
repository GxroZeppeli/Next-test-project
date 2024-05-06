import { auth } from "@/../auth";
import { placeOrder } from "@/lib/data";

export async function POST(req: Request) {
    const data = await req.json();
    const email = data.email;
    const session = await auth();

    if (session?.user?.email === email) {
        try {
            const result = await placeOrder(email);
            return new Response(result ? 'Order placed.' : 'Not enough stock.', { status: 200 });
        } catch (error) {
            console.log(error);
            return new Response('Failed to place order.', { status: 500 });
        }
    }
    return new Response('Failed to place order.', { status: 400 });
}