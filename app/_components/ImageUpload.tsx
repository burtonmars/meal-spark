import React, { useState } from 'react'

interface ImageUrlProps {
    setImageFile: (image: File | null) => void;
    htmlId?: string;
    label?: string;
    required?: boolean;
}

const ImageUpload = ({setImageFile, htmlId, label, required}: ImageUrlProps) => {

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

  return (
    <>
        <label htmlFor={htmlId}>{label}
            <input 
                id={label}
                type="file"
                accept=".jpg, .png, .gif, .jpeg"
                className="file-input file-input-bordered file-input-secondary file-input-sm w-full max-w-xs mt-1"
                onChange={handleImageChange}
            />
        </label>
    </>
  )
}

export default ImageUpload
