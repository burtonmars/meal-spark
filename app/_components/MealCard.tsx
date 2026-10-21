'use client';

import React, { useState } from 'react';
 
import ViewMealModal from './ViewMealModal';
import { Meal } from '../_lib/definitions';
import { navigateHome } from '../_lib/actions';
import Link from 'next/link';
import AreYouSureModal from './AreYouSureModal';
import { motion } from 'framer-motion';

interface MealCardProps {
    meal: Meal;
    deleteMeal: any;
    focussedTag: string | null;
}

const MealCard = ({meal, deleteMeal, focussedTag}: MealCardProps) => {
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const demoMealIds = [74, 75, 77];
        
    const handleDelete = async () => {
        if (demoMealIds.includes(meal.id)) {
            alert('You cannot delete this meal because it is a demo meal. Please create your own meal to delete.');
            return;
        }
        setSaving(true);
        try {
            await deleteMeal(meal.id);
        } catch (error) {
            console.error('Error deleting meal:', error);
        } finally {
            navigateHome();
            setSaving(false);
            setShowDeleteModal(false);
        }
    };
    
  return (
    <motion.div 
        className="card card-sm mb-12 md:mb-0 mx-12 w-5/6 lg:w-96 bg-base-100 shadow-xl h-[550px]"
        initial={{
            opacity: 0,
            scale: 0.8
        }}
        animate={{
            opacity: 1,
            scale: 1
        }}
        transition={{
            duration: 0.2
        }}
        >
        <figure className="w-full h-1/2 cursor-pointer" onClick={() => setShowModal(true)}>
            <img className="w-full h-full object-cover" src={meal.imagePath} alt="" />
        </figure>
        <div className="card-body flex flex-col justify-between h-2/5">
            <div className="truncate">
                <h2 className="card-title truncate">{meal.mainTitle}</h2>
                <h3>{meal.secondaryTitle}</h3>
            </div>
            <div className='h-1/4 overflow-auto'>
                <ul className='flex flex-wrap gap-2'>
                    {meal.tags.map((tag) => (
                        focussedTag && tag === focussedTag ? (
                            <li key={tag} className='badge mx-1 h-6 bg-primary border-none'>
                                <Link href={`/filtered-meals/${tag}`}>{tag}</Link>
                            </li>
                        ) : (
                            <li key={tag} className='badge mx-1 h-6 bg-accent border-none'>
                                <Link href={`/filtered-meals/${tag}`}>{tag}</Link>
                            </li>
                        )
                    ))}
                </ul>
            </div>
            <div className="card-actions mt-2 p-4">
                <div className='flex w-full justify-between'>
                    <form action={navigateHome}>
                        <button onClick={() => setShowDeleteModal(true)} className='btn btn-outline btn-error w-24' disabled={saving}>{saving ? 'deleting...' : 'delete'}</button>
                    </form>
                    <button className="btn btn-secondary w-30" onClick={() => setShowModal(true)}>view meal</button>
                    <dialog id="view_meal_modal" className="modal" open={showModal}>
                        <ViewMealModal meal={meal} closeModal={() => setShowModal(false)} />
                    </dialog>
                </div>
            </div>
        </div>
        <dialog id="delete_meal_modal" className="modal" open={showDeleteModal}>
            <AreYouSureModal handleDelete={handleDelete} setShowDeleteModal={setShowDeleteModal} mealTitle={meal.mainTitle}/>
        </dialog>
    </motion.div>
  );
};

export default MealCard;