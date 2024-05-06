'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Slideshow({
  slides,
}: {
  slides: { id: number; image: string; name: string; path: string; description: string }[];
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  const debounce = (func: any, timeout: number) => {
    let timer: any;
    return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(null, args);
      }, timeout);
    };
  };

  const switchSlide = (direction: number) => { // 0 - forward, 1 - backward
    const image = document.querySelector('.image');
    image?.classList.toggle('opacity-100');
    image?.classList.toggle('opacity-0');
    setTimeout(() => {
        setCurrentSlide(currentSlide => {
          if(direction === 0) {
            return (currentSlide + 1) % slides.length;
          } else {
            return (currentSlide - 1 + slides.length) % slides.length;
          }
        });
        image?.classList.toggle('opacity-0');
        image?.classList.toggle('opacity-100');
    }, 150);
  };

  const handleNextSlide = () => {
    clearInterval(sliderInterval.current);
    sliderInterval.current = setInterval(() => switchSlide(0), 5000);
    switchSlide(0);
  };

  const handlePrevSlide = () => {
    clearInterval(sliderInterval.current);
    sliderInterval.current = setInterval(() => switchSlide(0), 5000);
    switchSlide(1);
  };

  useEffect(() => {
    sliderInterval.current = setInterval(() => switchSlide(0), 5000);
    return () => clearInterval(sliderInterval.current);
  }, []);

  return (
    <div className="h-[30rem] md:h-[40rem] lg:h-[50rem] w-full bg-neutral-400 relative mb-8">
      <button onClick={debounce(handlePrevSlide, 250)} className='absolute top-1/2 left-5 -translate-y-1/2 z-10'>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="#292524"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <div className="image absolute top-0 left-0 right-0 bottom-0 transition-opacity opacity-100">
        <Link href={slides[currentSlide].path}>
          <Image 
              src={slides[currentSlide].image} 
              alt={slides[currentSlide].name} 
              className='w-full h-full object-cover'
              width={1800}
              height={800}
          />
        </Link>
      </div>

      <button onClick={debounce(handleNextSlide, 250)} className='absolute top-1/2 right-5 -translate-y-1/2 z-10'>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="#292524"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      <div className="absolute bottom-[-2rem] left-1/2 -translate-x-1/2 text-white opacity-95 px-10 py-6 rounded-2xl bg-neutral-800 flex flex-col gap-2 items-center w-5/6 lg:w-1/2">
        <span className='text-xl font-bold'>{slides[currentSlide].name}</span>
        <p>{slides[currentSlide].description}</p>
        <Link href={slides[currentSlide].path} className='bg-indigo-600 hover:bg-indigo-400 text-neutral-100 font-bold transition rounded-lg px-4 py-2'>
          Learn more
        </Link>
      </div>
    </div>
  );
}