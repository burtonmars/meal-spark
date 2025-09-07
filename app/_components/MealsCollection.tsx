'use client';

import React, { useState, useEffect } from 'react'

import MealCard from './MealCard'
import { useMeals, useDeleteMeal } from '../_lib/hooks/useMeals'

interface MealsCollectionProps {
    tag: string | null
}

const MealsCollection = ({ tag }: MealsCollectionProps) => {
  const { data: allMeals = [], isLoading } = useMeals();
  const deleteMealMutation = useDeleteMeal();
  const focussedTag = tag ? tag : null;
  const [noMeals, setNoMeals] = useState(false);

  // Filter meals by tag if provided
  const meals = tag ? allMeals.filter(meal => meal.tags.includes(tag)) : allMeals;

  useEffect(() => {
    if (meals.length === 0 && !isLoading) {
      setNoMeals(true);
    } else {
      setNoMeals(false);
    }
  }, [meals, isLoading]);

  const handleDeleteMeal = async (id: string) => {
    await deleteMealMutation.mutateAsync(id);
  };

  return (
    <>
        {isLoading ? 
        <div className='flex my-36 h-96 justify-center items-center'>
            <span className="loading loading-ring loading-lg"></span>
        </div> :
        <>
         {noMeals ? 
            <div className='flex h-96 my-36 flex-col justify-center items-center'>
                <h2 className='text-2xl font-bold mb-4'>No meals found</h2>
                <p className='text-lg'>Try adding a new meal</p>
            </div> :
            <>
                <div className='flex md:hidden flex-col justify-center items-center'>
                    {meals.map((meal) => <MealCard
                        key={meal.id}
                        meal={meal}
                        deleteMeal={handleDeleteMeal}
                        focussedTag={focussedTag} />
                    )}
                </div><div className="hidden w-full h-full md:flex justify-center">
                    <div className='w-full xl:w-4/5 lg:mt-36 grid justify-center gap-12'>
                        <div className='grid grid-cols-mealCards md:grid-cols-mealCardsMd xl:grid-cols-mealCardsXl gap-y-10 xl:gap-y-16 w-fit'>
                            {meals.map((meal) => <MealCard
                                key={meal.id}
                                meal={meal}
                                deleteMeal={handleDeleteMeal}
                                focussedTag={focussedTag} />
                            )}
                        </div>
                    </div>
                </div>
            </>}
        </>}
    </>
  )
}

export default MealsCollection