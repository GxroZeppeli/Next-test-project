import { alterProductAmount, deleteFromCart } from "@/lib/data";
import { auth } from "@/../auth";

export async function POST(req: Request) {
    const session = await auth();
    if (!session) return new Response('Unauthorized.', { status: 401 });
    const data = await req.json();
    const amount = data.amount;
    const id = data.id;
    
    if (amount && id) {
        try {
            const result = await alterProductAmount(id, amount);
            return new Response(result ? 'Amount changed.' : 'Not enough stock.', { status: 200 });
        } catch (error) {
            console.log(error);
            return new Response('Failed to change amount.', { status: 500 });
        }
    }
    return new Response('Failed to change amount.', { status: 400 });
}

export async function DELETE(req: Request) {
    const session = await auth();
    if (!session) return new Response('Unauthorized.', { status: 401 });
    const data = await req.json();
    const id = data.id;
    
    if (id) {
        try {
            await deleteFromCart(id);
            return new Response('Product deleted from cart.', { status: 200 });
        } catch (error) {
            console.log(error);
            return new Response('Failed to delete product.', { status: 500 });
        }
    }
    return new Response('Failed to delete product.', { status: 400 });
}