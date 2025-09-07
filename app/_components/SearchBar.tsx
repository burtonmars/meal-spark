'use client';

import React, { useEffect, useRef, useState } from 'react'
import TextField from '@mui/material/TextField';

import { Meal } from '../_lib/definitions';
import ViewMealModal from './ViewMealModal';
import { useMeals } from '../_lib/hooks/useMeals';

interface SearchBarProps {
    userId: string | null;
}

const SearchBar = ({ userId }: SearchBarProps) => {
  const { data: meals = [] } = useMeals();
  const wrapperRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [inputText, setInputText] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

    useEffect(() => {
        function handleClickOutside(event: { target: any; }) {
            if (wrapperRef.current && !(wrapperRef.current as HTMLElement).contains(event.target)) {
                setIsDropdownVisible(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    let inputHandler = (e: { target: { value: string; }; }) => {
        var lowerCase = e.target.value.toLowerCase();
        setInputText(lowerCase);
    };

    const filteredMeals = meals.filter((meal) => {
        if (inputText === '') {
            return '';
        }
        else {
            return meal.mainTitle.toLowerCase().includes(inputText)
        }
    })  

  return (
    <div className='relative' ref={wrapperRef}>
        <TextField
            id="outlined-basic"
            variant="outlined"
            fullWidth
            label="Search"
            onChange={inputHandler}
            disabled={!userId}
            onFocus={() => setIsDropdownVisible(true)}
        />
        {isDropdownVisible && (
            <ul className='absolute w-full bg-white shadow-lg rounded-lg overflow-y-auto max-h-60 z-10'>
            {filteredMeals.map((meal) => (
                <li key={meal.id} onClick={() => {
                    setSelectedMeal(meal);
                    setShowModal(true);
                    setIsDropdownVisible(false);
                }} className='p-2 hover:bg-gray-100 cursor-pointer'>
                    {meal.mainTitle}
                </li>
            ))}
        </ul>
        )}
        <dialog id="view_meal_modal" className="modal" open={showModal}>
            {selectedMeal && <ViewMealModal meal={selectedMeal} closeModal={() => setShowModal(false)} />}
        </dialog>
    </div>
  )
}

export default SearchBar