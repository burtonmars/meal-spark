import React, { useState } from 'react';
import Select, { MultiValue } from 'react-select';
import makeAnimated from 'react-select/animated';
import { useForm, SubmitHandler } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';

import { Meal, MealTag, mealTags } from '../_lib/definitions';
import { navigateHome } from '../_lib/actions';

interface AddMealModalProps { 
  saveNewMeal: (newMeal: any) => void;
  closeAddMealModal: () => void;
}

const animatedComponents = makeAnimated();

const AddMealModal = ({saveNewMeal, closeAddMealModal}: AddMealModalProps) => {
  const [tags, setMealTags] = useState<MultiValue<MealTag>>([]);
  const [saving, setSaving] = useState(false);
  const [newMealIngredients, setNewMealIngredients] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Meal>();

  const numberOfColumns = Math.ceil(newMealIngredients.length / 8);
  const columnWidth = 150;
  const columnGap = 20;
  const totalWidth = numberOfColumns * columnWidth + (numberOfColumns - 1) * columnGap;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNotes(event.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImageToCloudinary = async (image: Blob) => {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'ml_default');

    const response = await fetch(`https://api.cloudinary.com/v1_1/dv54qhjnt/image/upload`, {
        method: 'POST',
        body: formData,
    });

    if (response.ok) {
        const data = await response.json();
        return data.secure_url;
    }

    throw new Error('Image upload failed');
  };

  const addIngredient = () => {
    const ingredientInput = document.getElementById('ingredient') as HTMLInputElement;
    if (ingredientInput && ingredientInput.value.trim() !== '') {
      setNewMealIngredients([...newMealIngredients, ingredientInput.value]);
      ingredientInput.value = '';
    }
  };

  const removeIngredient = (indexToRemove: number) => {
    setNewMealIngredients(newMealIngredients.filter((_, index) => index !== indexToRemove));
  };
  
  const onSubmit: SubmitHandler<Meal> = async (newMeal: Meal) => {
      setSaving(true);
      try {
          if (imageFile) {
              const imageUrl = await uploadImageToCloudinary(imageFile);
              newMeal.imagePath = imageUrl;
          }
          newMeal.tags = tags.map((tag: any) => tag.value);
          newMeal.ingredients = newMealIngredients;
          newMeal.notes = notes;
          await saveNewMeal(newMeal);
          resetForm();
          closeAddMealModal();
      } catch (error) {
          console.error("An error occurred:", error);
      } finally {
          setSaving(false);
          navigateHome();
      }
  };

  const resetForm = () => {
    reset();
    setMealTags([]);
    setNewMealIngredients([]);
    setImageFile(null);
    setNotes('');
  };

  return (
    <div className="modal-box shadow-2xlDark max-w-none w-4/5 md:w-2/3 xl:w-4/12 h-full max-h-none lg:h-4/5">
        <form className='mb-4' method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeAddMealModal}>✕</button>
        </form>
        <div className="flex justify-center text-lg font-bold mb-6">
          <h1>add new meal</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col mb-4'>
            <label className="input input-bordered flex items-center gap-2">
              meal name
              <input type="text" className="grow" id="mainTitle" {...register("mainTitle", { required: true, maxLength: 30 })}/>
              {errors.mainTitle && errors.mainTitle.type === "required" && <span className='text-error-red'>This is required</span>}
              {errors.mainTitle && errors.mainTitle.type === "maxLength" && <span className='text-error-red'>Max length exceeded</span> }
            </label>
          </div>
          <div className='flex flex-col mb-4'>
            <label className="input input-bordered flex items-center gap-2">
              description
              <input type="text" className="grow" id="secondaryTitle" {...register("secondaryTitle", { required: true, maxLength: 60 })}/>
                {errors.secondaryTitle && errors.secondaryTitle.type === "required" && <span className='text-error-red'>This is required</span>}
                {errors.secondaryTitle && errors.secondaryTitle.type === "maxLength" && <span className='text-error-red'>Max length exceeded</span> }
            </label>
          </div>
          <div className='flex flex-col mb-4'>
            <label className="input input-bordered flex items-center gap-2">
              ingredients
              <input type="text" className="grow" id="ingredient"/>
              <button type='button' className='btn btn-accent btn-sm' onClick={addIngredient}>add</button>
            </label>
            <div className='flex justify-start ml-4 mt-4'>
             <ul style={{ columnCount: numberOfColumns, columnGap: `${columnGap}px`, width: `${totalWidth}px` }}>
                {newMealIngredients.map((ingredient, index) =>
                <div className='w-full flex justify-between p-1' key={uuidv4()}>
                  <li>{ingredient}</li>
                  <button className='btn btn-xs btn-accent opacity-60' onClick={() => removeIngredient(index)}>X</button>
                </div>)}
              </ul>
            </div>
          </div>
          <div className='flex flex-col mb-4'>
            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              options={mealTags}
              onChange={(tag) => setMealTags(tag as any)}
              value={tags}
              id='tags'
            />
          </div>
          <div className='flex flex-col mb-4'>
            <label htmlFor="mealImage" className='mb-2'>image</label>
            <input 
                id="mealImage"
                type="file"
                accept=".jpg, .png, .gif, .jpeg"
                className="file-input file-input-bordered file-input-secondary file-input-sm w-full max-w-xs"
                onChange={handleImageChange}
              />
          </div>
          <div className='flex flex-col'>
            <label className="form-control">
                <div className="label">
                    <span className="label-text">notes</span>
                </div>
                <textarea className="textarea textarea-bordered h-24" id='meal_modal_notes' onChange={handleChange}></textarea>
            </label>
            <div className='flex justify-end mt-6'>
                <button type='submit' className='btn btn-primary w-24' disabled={saving}>{saving ? 'saving...' : 'save'}</button>
            </div>
          </div>
        </form>
    </div>
  );
};

export default AddMealModal;