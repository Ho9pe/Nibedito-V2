'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiUpload, FiX, FiPlus } from 'react-icons/fi';

export default function ImageManager({ 
    currentImage, 
    onImageChange,
    onImageRemove,
    multiple = false,
    maxImages = 5,
    title = "Image",
    variantIndex
}) {
    const [previewUrls, setPreviewUrls] = useState(
        multiple ? (currentImage || []) : (currentImage ? [currentImage] : [])
    );
    const [removedIndices, setRemovedIndices] = useState([]);

    // Update previewUrls when currentImage changes
    useEffect(() => {
        setPreviewUrls(multiple ? (currentImage || []) : (currentImage ? [currentImage] : []));
        setRemovedIndices([]); // Reset removed indices when currentImage updates
    }, [currentImage, multiple]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        if (multiple) {
            const currentCount = previewUrls.length - removedIndices.length;
            if (currentCount + files.length > maxImages) {
                alert(`Maximum ${maxImages} images allowed`);
                return;
            }
            onImageChange(files, removedIndices);
        } else {
            const file = files[0];
            if (file) {
                onImageChange(file);
            }
        }
    };

    const removeImage = (index) => {
        setRemovedIndices(prev => [...prev, index]);
        onImageChange([], [...removedIndices, index]); // Pass empty files array and updated removedIndices
    };

    return (
        <div className="image-manager">
            <h3>{title}</h3>
            
            <div className="image-previews">
                {previewUrls
                    .filter((_, index) => !removedIndices.includes(index))
                    .map((url, index) => (
                        <div key={`${url}-${index}`} className="image-preview">
                            <Image
                                src={url}
                                alt={`Preview ${index + 1}`}
                                width={200}
                                height={200}
                                className="preview-img"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="remove-image"
                            >
                                <FiX />
                            </button>
                        </div>
                    ))}
            </div>

            <label className="image-upload-container">
                <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    multiple={multiple}
                    className="hidden"
                    disabled={multiple && (previewUrls.length - removedIndices.length) >= maxImages}
                />
                <div className="upload-placeholder">
                    <FiUpload className="upload-icon" />
                    <span>
                        {multiple 
                            ? `Upload images (${previewUrls.length - removedIndices.length}/${maxImages})`
                            : 'Replace image'
                        }
                    </span>
                </div>
            </label>
        </div>
    );
}
