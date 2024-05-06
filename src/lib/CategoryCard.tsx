import Image from 'next/image';
import Link from 'next/link';

export default function CategoryCard({category, link, image}: {category: string, link: string, image: string}) {
    return (
      <div className="relative h-64 xl:h-80 rounded-xl overflow-hidden">
        <Image 
          className="absolute top-0 left-0 right-0 bottom-0 h-full w-full object-cover"
          src={image}
          alt=''
          width={500}
          height={250}
        />
        <div className="absolute top-10 left-10 right-10 bottom-10 z-10 bg-[#35353b8e] flex flex-col justify-center items-center rounded-xl">
          <h2 className='text-xl font-bold mb-4'>{category}</h2>
          <Link href={link} className='bg-indigo-600 hover:bg-indigo-400 text-neutral-100 font-bold transition rounded-lg px-4 py-2'>
            More
          </Link>
        </div>
      </div>
    );
  }