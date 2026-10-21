import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Meal } from '../_lib/definitions';
import { updateMeal } from '../_lib/data';
import { navigateHome } from '../_lib/actions';

interface MealModalProps {
    meal: Meal;
    closeModal: () => void;
}

const ViewMealModal = ({ meal, closeModal }: MealModalProps) => {
    const [notes, setNotes] = useState(meal.notes);
    const [saving, setSaving] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNotes(event.target.value);
    };

    useEffect(() => {
        setNotes(meal.notes);
    }, [meal])

const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
        meal.notes = notes;
        await updateMeal(meal);
        closeModal();
    }catch (error) {
        console.error("An error occurred:", error);
    } finally {
        setSaving(false);
        await navigateHome();
    }
};

  return (
    <div className="modal-box max-w-none w-4/5 md:w-1/2 xl:w-4/12 h-[90%]">
        <form className='mb-4' method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>✕</button>
        </form>
        <figure className="w-full h-2/5">
            <img className="w-full h-full object-cover" src={meal.imagePath} alt="" />
        </figure>
        <form onSubmit={handleSubmit}>
            <div className='flex flex-col gap-2'>
                <h2 className='text-xl font-bold mt-4'>{meal.mainTitle}</h2>
                <h3 className='text-lg'>{meal.secondaryTitle}</h3>
                <div className='my-1 lg:my-2'>
                    <ul className='flex flex-wrap gap-2 lg:gap-0'>
                        {meal.tags.map((tag) => 
                            <li key={uuidv4()} className='badge mx-0 lg:mx-1 h-6 bg-accent border-none font-semibold'>{tag}</li>
                        )}
                    </ul>
                </div>
                <div className='max-w-[450px]'>
                    <h3 className='font-semibold text-md lg:text-lg'>Ingredients</h3>
                    <ul className='flex flex-col flex-wrap text-sm list-none mx-2 lg:mx-4 my-2 max-h-32'>
                        {meal.ingredients.map((ingredient) => 
                            <li key={uuidv4()} className='text-md lg:text-[1rem] my-0 lg:my-1' style={{ pageBreakInside: 'avoid', breakInside: 'avoid-column' }}>
                                {ingredient}
                            </li>
                        )}
                    </ul>
                </div>
                <div className='flex flex-col'>
                    <label className="flex flex-col gap-1">
                        <div className="label py-1">
                            <span>notes</span>
                        </div>
                        <textarea className="textarea h-24" id='meal_modal_notes' value={notes} onChange={handleChange}></textarea>
                    </label>
                    <div className='flex justify-end mt-6'>
                        <button type='submit' className='btn btn-primary w-24' disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
    );
};

export default ViewMealModal;