import { auth } from "@/../../auth";
import { getRole, updateOrder } from "@/lib/data";

export async function PUT(req: Request) {
    const session = await auth();
    if (!session) return new Response('Unauthorized.', { status: 401 });
    const userRole = await getRole(session?.user?.email as string);
    if (userRole !== 'admin') return new Response('Unauthorized.', { status: 401 });
    try {
        const data = await req.json();
        
        await updateOrder(data.id, data.status, data.details);

        return new Response('Product updated.', { status: 200 });
    }
    catch (error) {
        console.log(error);
        return new Response('Failed to update product.', { status: 500 });
    }
}