'use client';

import React from 'react';
import MealsCollection from './_components/MealsCollection';

export default function Page() {
  return (
    <div className='w-full h-full mt-10 mb-36 md:mt-0'>
        <MealsCollection tag={null}></MealsCollection>
    </div>
  )
}