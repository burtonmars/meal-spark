import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import Image from 'next/image';
import { Meal } from '../_lib/definitions';

const h1Title = 'which image suites your meal best?';
interface ChooseAiImageModalProps {
    closeChooseImageModal: () => void;
    setImageFile: (image: File | null) => void;
}

const ChooseAiImageModal = ({ closeChooseImageModal, setImageFile }: ChooseAiImageModalProps) => {
    const [ loading, setLoading ] = useState(false);
    const [ saving, setSaving ] = useState(false);

    const { 
        register,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: { errors }
      } = useForm<{ file: File | null }>();

     const onSubmit: SubmitHandler<{ file: File | null }> = () => {
      setSaving(true);

      setSaving(false);
     }

  return (
    <div className="modal-box shadow-2xlDark">
        <form className='mb-4' method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" 
              onClick={closeChooseImageModal}>✕
            </button>
        </form>
        <div className="flex justify-center text-lg font-bold mb-6">
          <h1>{h1Title}</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-center items-center">
            <div>
              <Image src='' alt='first AI generated image'></Image>
            </div>
            <div>
              <Image src='' alt='second AI generated image'></Image>
            </div>
          </div>
          <div className="flex justify-between items-center">
              <button type='submit' className='btn btn-primary w-24' disabled={saving}>{saving ? 'saving...' : 'okay'}</button>
          </div>
        </form>
    </div>
  )
}

export default ChooseAiImageModal
