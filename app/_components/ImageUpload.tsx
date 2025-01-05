import React, { useState, useRef } from 'react'
import Image from 'next/image';
import trashCan from '../../public/trash-can.svg';

interface ImageUrlProps {
    setImageFile: (image: File | null) => void;
    htmlId?: string;
    label?: string;
    required?: boolean;
}

const ImageUpload = ({setImageFile, htmlId, label, required}: ImageUrlProps) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const deleteImage = (e: React.MouseEvent<HTMLImageElement>) => {
        setImageFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

  return (
    <>
        <label htmlFor={htmlId}>{label}
            <div className='flex gap-4 items-center mt-1'>
                <input 
                    id={label}
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg, .png, .gif, .jpeg"
                    className="file-input file-input-bordered file-input-warning file-input-sm w-full max-w-xs"
                    onChange={handleImageChange}
                />
                <div>
                    <Image
                        src={trashCan}
                        alt='trash-can'
                        height={20}
                        onClick={deleteImage}
                        className='cursor-pointer'>
                    </Image>
                </div>
            </div>
        </label>
    </>
  )
}

export default ImageUpload

