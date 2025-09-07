'use client';

import MealsCollection from '@/app/_components/MealsCollection';
import { useParams } from 'next/navigation';

import React from 'react';

export default function Page() {
  const params = useParams();
  const tag = decodeURIComponent(params.tag as string);
  
  return (
    <div className='flex flex-col items-center w-full h-full mt-10 md:mt-0'>
        <MealsCollection tag={tag}></MealsCollection>
    </div>
  )
}