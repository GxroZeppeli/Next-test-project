import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({name, path, image, price, discount, discountedPrice}: 
        {name: string, path: string, image: string, price: string, discount: string, discountedPrice: string}) 
    {

    return (
      <div className="aspect-square flex flex-col items-center snap-center">
        <Link href={'/products/' + path} className='relative w-full aspect-square rounded-xl overflow-hidden'>
            {discount &&
                <div className='absolute top-1 -left-8 bg-teal-500 font-bold px-10 py-1 z-10 -rotate-45'>
                    {discount}%
                </div>
            }
            <Image 
            className="absolute top-0 left-0 right-0 bottom-0 h-full w-full object-cover"
            src={image}
            alt=''
            width={500}
            height={250}
            />
        </Link>
        <div className="mt-2 text-center">
            <Link href={'/products/' + path} className='text-neutral-100 hover:text-neutral-300 uppercase'>{name}</Link>
            <p>From {discount ? <><b>{discountedPrice}</b> <s>{price}</s></>  : <b>{price}</b>}</p>
        </div>
      </div>
    );
}