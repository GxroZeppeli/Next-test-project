'use client';
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Slideshow({
  slides,
}: {
  slides: { id: number; image: string; name: string; path: string; description: string }[];
}) {
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
    if(!image) return;
    const width = image.clientWidth;
    if (direction === 0 && image.scrollLeft + width >= image.scrollWidth) {
      image.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      return;
    }
    if (direction === 1 && image.scrollLeft - width < 0) {
      image.scrollTo({
        top: 0,
        left: image.scrollWidth,
        behavior: 'smooth'
      });
      return;
    }
    image.scrollBy({
      top: 0,
      left: direction === 0 ? width : -width,
      behavior: 'smooth'
    });
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

  const onScroll = () => {
    clearInterval(sliderInterval.current);
    sliderInterval.current = setInterval(() => switchSlide(0), 5000);
  };

  useEffect(() => {
    sliderInterval.current = setInterval(() => switchSlide(0), 5000);
    return () => clearInterval(sliderInterval.current);
  }, []);

  return (
    <div className="h-[30rem] md:h-[24rem] lg:h-[30rem] xl:h-[36em] 2xl:h-[50rem] w-full relative overflow-hidden">
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

      <div className="image w-full h-full flex overflow-x-auto overflow-y-hidden snap-mandatory snap-x" onScroll={onScroll}>
        {slides.map((slide: any) => (
            <div key={slide.id} className="w-screen h-full snap-center flex-shrink-0 relative">
              <Link   href={slide.path}>
                <Image
                  src={slide.image}
                  alt={slide.name}
                  width={1920}
                  height={1080}
                  className="w-full h-full object-cover"
                />
              </Link>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white opacity-95 px-10 py-6 rounded-2xl bg-neutral-800 flex flex-col gap-2 items-center w-5/6 lg:w-1/2">
                <span className='text-xl font-bold'>{slide.name}</span>
                <p>{slide.description}</p>
                <Link href={slide.path} className='bg-indigo-600 hover:bg-indigo-400 text-neutral-100 font-bold transition rounded-lg px-4 py-2'>
                  Learn more
                </Link>
              </div>
            </div>
          ))}
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
    </div>
  );
}