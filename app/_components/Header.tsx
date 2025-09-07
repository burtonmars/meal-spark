'use client';

import React, { useEffect, useState } from 'react';
import AddMealModal from './AddMealModal';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation'
import Link from 'next/link';
import { motion } from 'framer-motion';

import SearchBar from './SearchBar';
import { useMeals } from '../_lib/hooks/useMeals';

interface HeaderProps {
    userId: string | null;
}

const Header = ({ userId }: HeaderProps) => {
  const { data: meals = [] } = useMeals();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isWiggling, setIsWiggling] = useState(!!meals.length);
  const [wiggleCount, setWiggleCount] = useState(0);
  const maxDemoMealCount = 15;
  const pathname = usePathname();

  useEffect(() => {
    const interval = setInterval(() => {
      if (meals.length === 0 && wiggleCount < 8 && userId) {
        setIsWiggling(prev => !prev);
        setWiggleCount(prev => prev + 1);
      } else {
        setIsWiggling(false);
      }
    }, 1200);
    return () => clearInterval(interval);
  }, [meals, wiggleCount]);

  return (
    <nav className="navbar flex-col md:flex-row w-full justify-around lg:px-16 lg:w-3/4 2xl:w-2/3">
        <div className='flex md:hidden justify-center items-center w-full mb-2 px-4'>
            <div className='w-full'>
                <br />
            </div>
            <div className="w-full flex md:hidden justify-center items-center">
                <a className="btn btn-ghost text-2xl">meal spark</a>
            </div>
            <div className='w-full flex md:hidden justify-end'>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </div>
        <div className='flex w-full justify-between my-4 px-4'>
            <div className='flex h-full w-5/6 md:w-full items-center'>
                {pathname === '/' &&
                    <motion.button 
                        className="btn btn-primary text-md xl:text-lg w-3/5 md:w-2/5 lg:w-3/5 xl:w-2/5" 
                        disabled={!userId || meals.length >= maxDemoMealCount} 
                        onClick={() => setShowAddModal(true)}
                        animate={{ 
                            rotate: isWiggling ? [-5, 5, -5, 5, 0] : 0
                        }}
                        transition={{ duration: 0.6 }}>
                        new meal
                    </motion.button>
                }
                {pathname !== '/' && 
                    <div className='btn btn-accent text-md xl:text-lg w-3/5 md:w-2/5 lg:w-3/5 xl:w-2/5'>
                        <Link href="/">Back</Link>
                    </div>
                }
                {meals.length >= maxDemoMealCount && 
                <span className='text-red-500 text-sm ml-2'>You have reached the maximum number of meals for the demo account.</span>}
                <dialog id="add_meal_modal" className="modal" open={showAddModal}>
                    <AddMealModal closeAddMealModal={() => setShowAddModal(false)} />
                </dialog>
            </div>
            <div className="hidden w-full md:flex justify-center">
                <h1 className="btn btn-ghost text-[2.2rem]">meal spark</h1>
            </div>
            <div className='flex h-full w-full justify-end items-center'>
                <div className='md:mx-8'>
                    <SearchBar userId={userId}/>
                </div>
                <div className='hidden md:flex'>
                    <SignedOut>
                        <SignInButton />
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
        </div>
    </nav>
  )
}

export default Header;