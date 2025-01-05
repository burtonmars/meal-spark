import React, { useEffect, useState } from 'react';
import Select, { MultiValue } from 'react-select';
import makeAnimated from 'react-select/animated';
import { useForm, SubmitHandler } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';

import { Meal, MealTag, mealTags } from '../_lib/definitions';
import { saveNewMeal } from '../_lib/data';
import { navigateHome } from '../_lib/actions';
import ImageUpload from './ImageUpload';
import ChooseAiImageModal from './ChooseAiImageModal';

interface AddMealModalProps {
  closeAddMealModal: () => void;
}

const animatedComponents = makeAnimated();
const aiImageGenText = 'upload an image or let us generate one for you';


const AddMealModal = ({ closeAddMealModal}: AddMealModalProps) => {
  const [tags, setMealTags] = useState<MultiValue<MealTag>>([]);
  const [saving, setSaving] = useState(false);
  const [newMealIngredients, setNewMealIngredients] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [disableGenImageBtn, setdisableGenImageBtn] = useState(false);
  const [notes, setNotes] = useState('');
  const [showChooseImageModal, setShowChooseImageModal] = useState(false);
  const { 
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<Meal>();

  const maxIngredients = 18;
  const numberOfColumns = Math.ceil(newMealIngredients.length / 8);
  const columnWidth = 150;
  const columnGap = 20;
  const totalWidth = numberOfColumns * columnWidth + (numberOfColumns - 1) * columnGap;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNotes(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const inputElement = event.currentTarget as HTMLInputElement;
      if (inputElement.value.trim() !== '') {
        addIngredient();
      }
    }
  };

  useEffect(() => {
    if (newMealIngredients.length <= maxIngredients) {
      clearErrors('ingredients');
    }
  }, [newMealIngredients, maxIngredients, setError, clearErrors]);

  useEffect(() => {
    setdisableGenImageBtn(!!imageFile || saving);
  }, [imageFile, saving]);

  const addIngredient = () => {
    const ingredientInput = document.getElementById('ingredient') as HTMLInputElement;
    if (ingredientInput && ingredientInput.value.trim() !== '') {
      if (newMealIngredients.length < maxIngredients) {
        setNewMealIngredients([...newMealIngredients, ingredientInput.value]);
        ingredientInput.value = '';
      } else if (newMealIngredients.length === maxIngredients) {
        setNewMealIngredients([...newMealIngredients, ingredientInput.value]);
        ingredientInput.value = '';
        setError('ingredients', { type: 'max', message: `Maximum ${maxIngredients} ingredients allowed.` });
      }
    }
  };

  const removeIngredient = (indexToRemove: number) => {
    setNewMealIngredients(newMealIngredients.filter((_, index) => index !== indexToRemove));
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
    
    const downloadAiImage = async (imageUrl: string): Promise<File | null> => {
        try {
          const response = await fetch(imageUrl);

          if (!response.ok) {
              throw new Error(`Failed to fetch image: ${response.statusText}`);
          }

          const blob = await response.blob();
          const fileName = imageUrl.split('/').pop() || 'downloaded-image.png'; // Extract filename or use a default
          const file = new File([blob], fileName, { type: blob.type });

          return file;
        } catch (error) {
        console.error('Error downloading AI image:', error);
        return null;
        }
    }

    const generateImages = async (meal: Meal): Promise<File[]> => {
        setLoading(true);
        let aiImageFiles: File[] = [];

        const payload = {
            prompt: `${meal.mainTitle}, ${meal.secondaryTitle}`,
            imageSize: { width: 1024, height: 1024 },
            numImages: 2,
            outputFormat: 'png',
        };

        try {
            const response = await fetch('../api/image-gen', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            });

            const data = await response.json();
            const theHiveImages = data?.output;

            if (theHiveImages) {
              for (let image of theHiveImages) {
                let imageFile = await downloadAiImage(image.url);
                if (imageFile) { 
                  aiImageFiles.push(imageFile);
                } else {
                  console.error('Failed to download AI image');
                }
              }
            }
        } catch (error) {
            console.error('Error generating images:', error);
        } finally {
            setLoading(false);
        }
        return aiImageFiles;
    };

  const onSubmit: SubmitHandler<Meal> = async (newMeal: Meal) => {
      setSaving(true);
      try {
          let imageUrl  = 'https://res.cloudinary.com/dv54qhjnt/image/upload/v1713567949/pexels-yente-van-eynde-1263034-2403392_nv2ihw.jpg';

          // Generate image if not uploaded by user
          if (!imageFile) {
              const aiImageFiles = await generateImages(newMeal);
              if (!aiImageFiles.length) {
                  throw new Error("Failed to generate image files.");
              }
              let aiImageUrls = await Promise.all(aiImageFiles.map(async (file) => await uploadImageToCloudinary(file)));
              imageUrl = aiImageUrls[0];
            } else imageUrl = await uploadImageToCloudinary(imageFile);

          newMeal.imagePath = imageUrl;
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
              <input type="text" className="grow" id="mainTitle" {...register("mainTitle", { required: true, maxLength: 35 })}/>
              {errors.mainTitle && errors.mainTitle.type === "required" && <span className='text-error-red'>This is required</span>}
              {errors.mainTitle && errors.mainTitle.type === "maxLength" && <span className='text-error-red'>Max length exceeded</span> }
            </label>
          </div>
          <div className='flex flex-col mb-4'>
            <label className="input input-bordered flex items-center gap-2">
              description
              <input type="text" className="grow" id="secondaryTitle" {...register("secondaryTitle", { required: true, maxLength: 250 })}/>
                {errors.secondaryTitle && errors.secondaryTitle.type === "required" && <span className='text-error-red'>This is required</span>}
                {errors.secondaryTitle && errors.secondaryTitle.type === "maxLength" && <span className='text-error-red'>Max length exceeded</span> }
            </label>
          </div>
          <div className='flex flex-col mb-4'>
            <label className="input input-bordered flex items-center gap-2">
              ingredients
              <input type="text" className="grow" id="ingredient" onKeyDown={handleKeyPress}/>
              <button type='button' className='btn btn-accent btn-sm' onClick={addIngredient}>add</button>
            </label>
            {errors.ingredients && errors.ingredients.type === "max" && <span className='text-error-red p-2'>Maximum ingredients exceeded</span>}
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
          <div className='flex flex-col justify-center mb-4'>
            <div className='flex flex-col mb-4'>
              <ImageUpload required={true} setImageFile={ setImageFile } htmlId="mealImage" label={aiImageGenText}/>
            </div>
            <div className='flex flex-col mb-4'>
              <button onClick={() => setShowChooseImageModal(true)} disabled={disableGenImageBtn} className='btn btn-secondary w-1/4'>generate image</button>
          </div>
          </div>
          <div className='flex flex-col'>
            <label className="form-control">
                <div className="label">
                    <span className="label-text">notes</span>
                </div>
                <textarea className="textarea textarea-bordered h-24" id='meal_modal_notes' onChange={handleChange}></textarea>
            </label>
            <div className='flex justify-end mt-6 gap-4'>
               <div>
                  <button className='btn btn-outline btn-accent w-24' onClick={resetForm} disabled={saving}>cancel</button>
              </div>
              <div>
                  <button type='submit' className='btn btn-primary w-24' disabled={saving}>{saving ? 'saving...' : 'save'}</button>
              </div>
            </div>
          </div>
        </form>
        <div className='flex h-full w-full md:w-full items-center justify-center'>
          <dialog id="add_meal_modal" className="modal" open={showChooseImageModal}>
            <ChooseAiImageModal setImageFile={setImageFile} closeChooseImageModal={() => setShowChooseImageModal(false)} />
          </dialog>
        </div>
    </div>
  );
};

export default AddMealModal;