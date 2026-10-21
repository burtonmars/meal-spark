'use client';

import { SignInButton, useSignIn } from '@clerk/nextjs'
import React from 'react'
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation'

const LandingPage = () => {
    const { signIn } = useSignIn();
    const router = useRouter();

    const handleDemoLogin = async () => {
        const { error } = await signIn.password({
            identifier: 'mealspark.demo@yahoo.com',
            password: 'Mealspark2024!',
        });
        if (error) {
            console.error(JSON.stringify(error, null, 2))
            return
        }

        if (signIn.status === 'complete') {
            await signIn.finalize()
            router.refresh()
        } else {
            console.error('Demo sign in not complete:', signIn.status)
        }
    };

  const imagePath = 'https://res.cloudinary.com/dv54qhjnt/image/upload/v1712097910/salmon_dinner_qkzoe1.jpg'
  return (
    <motion.div 
        className='card card-sm my-10 md:my-24 w-5/6 lg:w-96 bg-base-100 shadow-xl h-[560px] max-w-[400px]'
        initial={{
            opacity: 0,
            scale: 0.8
        }}
        animate={{
            opacity: 1,
            scale: 1
        }}>
       <figure className="w-full h-1/2">
            <img className="w-full h-full object-cover" src={imagePath} alt="" />
        </figure>
        <div className='h-1/2 my-8 w-full flex flex-col justify-center items-center text-center'>
            <div className="card-body flex flex-col justify-between h-[40%]">
                <div className='text-2xl'><span className='text-red-500 font-bold'>welcome</span> to meal spark!</div>
                <div className='text-xl'>the perfect place to store all your favorite meal ideas.</div>
                <div className='text-xl'>ready to add to your collection?</div>
                <div className='text-2xl flex justify-center gap-2'>
                    <span>
                        <SignInButton>
                            <button className='text-green-500 font-bold'>sign in</button>
                        </SignInButton>
                    </span> to start
                </div>
                <div>
                    <span className='text-xl mb-2'>or try the </span><button className='text-xl text-blue-400' onClick={handleDemoLogin}>demo account</button>
                </div>
            </div>
        </div>
    </motion.div>
  )
}

export default LandingPage;