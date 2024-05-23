import { createProduct, getRole, updateProduct } from "@/lib/data";
import fs from 'node:fs';
import { auth } from "@/../../auth";

export async function PUT(req: Request) {
    const session = await auth();
    if (!session) return new Response('Unauthorized.', { status: 401 });
    const userRole = await getRole(session?.user?.email as string);
    if (userRole !== 'admin') return new Response('Unauthorized.', { status: 401 });
    try {
        const data = await req.json();
        
        // convert base64 image to file
        if (data.image.includes('base64')) {
            const matches = data.image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            const type = matches[1];
            const imageData = Buffer.from(matches[2], 'base64');
            
            const imageName = `${Date.now()}.${type.split('/')[1]}`;
            const filePath = `public/${imageName}`;
            fs.writeFile(filePath, imageData, 'binary', (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('Image saved to ' + filePath);
            });
            fs.unlinkSync(`public/${data.oldImage}`);

            await updateProduct(data.id, data.name, data.type, data.price, data.discount, data.path, '/' + imageName, data.brand, data.stock);
        } 
        else await updateProduct(data.id, data.name, data.type, data.price, data.discount, data.path, data.image, data.brand, data.stock);

        return new Response('Product updated.', { status: 200 });
    }
    catch (error) {
        console.log(error);
        return new Response('Failed to update product.', { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session) return new Response('Unauthorized.', { status: 401 });
    const userRole = await getRole(session?.user?.email as string);
    if (userRole !== 'admin') return new Response('Unauthorized.', { status: 401 });
    try {
        const data = await req.json();

        const matches = data.image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        const type = matches[1];
        const imageData = Buffer.from(matches[2], 'base64');
        
        const imageName = `${Date.now()}.${type.split('/')[1]}`;
        const filePath = `public/${imageName}`;
        fs.writeFile(filePath, imageData, 'binary', (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Image saved to ' + filePath);
        });

        await createProduct(data.name, data.type, data.price, data.discount, data.path, '/' + imageName, data.brand, data.stock);
        return new Response('Product updated.', { status: 200 });
    }
    catch (error) {
        console.log(error);
        return new Response('Failed to update product.', { status: 500 });
    }
}