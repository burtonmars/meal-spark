'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { auth, currentUser } from "@clerk/nextjs/server";

import Header from './_components/Header';
import MealCard from './_components/MealCard';
import { Meal } from './_lib/definitions';
import { fetchMeals } from './_lib/data';

const prisma = new PrismaClient();

const { userId } = auth();

async function saveNotes(id: number, notes: string): Promise<void> {
  "use server";

  try {
      await prisma.meal.update({
          where: {
              id: id,
          },
          data: {
              notes: notes,
          },
      });
  } catch (error) {
      console.error('Error saving notes:', error);
  }
}

async function saveNewMeal(meal: Meal): Promise<void> { 
  'use server';
  if (!meal.imagePath) {
      meal.imagePath = 'https://res.cloudinary.com/dv54qhjnt/image/upload/v1713567949/pexels-yente-van-eynde-1263034-2403392_nv2ihw.jpg';
  }

  if (userId) {
    try {
      await prisma.meal.create({
          data: {
              userId: userId,
              mainTitle: meal.mainTitle,
              secondaryTitle: meal.secondaryTitle,
              imagePath: meal.imagePath,
              tags: meal.tags,
              ingredients: meal.ingredients,
              notes: meal.notes,
          },
      });
      revalidatePath('/');
      redirect('/');
    } catch (error) {
        console.error('Error saving new meal:', error);
    }
  } else {
    console.error('Error saving new meal: User not signed in');
  }
}

async function deleteMeal(mealId: number): Promise<void> {
  'use server';

  try {
      await prisma.meal.delete({
          where: {
              id: mealId,
          },
      });
      revalidatePath('/');
      redirect('/');
  } catch (error) {
      console.error('Error deleting meal:', error);
  }
}

export default async function Home() {
  let meals: Meal[] = [];
  if (userId) {
    meals = await fetchMeals(userId)
        .then(
            (meals) => {
            return meals.reverse();
            }
        );
  }

  return (
   <main className='flex flex-col h-full'>
    <div className='flex justify-center mt-6'>
      <Header saveNewMeal={saveNewMeal} />
    </div>
    <SignedOut >
        <div className='flex flex-col w-full h-full mt-48 justify-center items-center'>
            <div className='text-2xl'>Welcome to what's for dinner!</div>
            <div className='text-2xl'>Please sign in</div>
        </div>
    </SignedOut>
    <SignedIn>
        <div className="flex justify-center">
            <div className='flex flex-col items-center h-[80vh] md:h-4/5 md:grid md:grid-cols-2 
                lg:grid-cols-[500px_minmax(500px,_1fr)_500px]'>
                {meals.map((meal: Meal) => 
                    <MealCard key={meal.id} meal={meal} saveNotes={saveNotes} deleteMeal={deleteMeal}/>)}
            </div>
        </div>
    </SignedIn>
   </main>
  )
}
