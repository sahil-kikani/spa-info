'use client'
import React, { useCallback, useState } from 'react'
import FormPreview from '../formPreview'
import { X } from 'lucide-react'
import axios from 'axios'
import { baseUrl } from '../../constant'
import { fileToBase64 } from '../../utils'

const SpaForm = () => {
  const [formData, setFormData] = useState({
    spa_name: '',
    city: '',
    area: '',
    price: '',
    timing: ''
  })

  const [errors, setErrors] = useState({})
  const [selectedImages, setSelectedImages] = useState([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const validateForm = () => {
    let newErrors = {}
    if (!formData.spa_name) newErrors.spa_name = 'Spa name is required'
    if (!formData.city) newErrors.city = 'City is required'
    if (!formData.area) newErrors.area = 'Area is required'
    if (!formData.price) newErrors.price = 'Price is required'
    if (!formData.timing) newErrors.timing = 'Timing is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ! Set FormData after field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    
    try {
      const newImages = await Promise.all(
        files.map(async (file) => ({
          file,
          url: URL.createObjectURL(file),
          base64: await fileToBase64(file)
        }))
      );
      
      setSelectedImages(prev => [...prev, ...newImages]);
    } catch (error) {
      alert('Error processing images: ' + error.message);
    }
  };

  // ! Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const newImages = selectedImages.map(img => img?.base64)
      const formDataToSend ={ ...formData, images : newImages,}

      const response = await axios.post(baseUrl, formDataToSend, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        alert('Form submitted successfully!')
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      alert('Error submitting form: ' + error.message)
    }
  }

  const removeImage = useCallback(
    (indexToRemove) => {
      setSelectedImages((prev) => {
        // Revoke the URL to prevent memory leaks
        URL.revokeObjectURL(prev[indexToRemove].url)
        const newImages = prev.filter((_, index) => index !== indexToRemove)

        // Adjust current image index if necessary
        if (currentImageIndex >= newImages.length) {
          setCurrentImageIndex(Math.max(0, newImages.length - 1))
        }

        return newImages
      })
    },
    [currentImageIndex]
  )

  return (
    <div className='min-h-screen bg-gray-100 p-4'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col md:flex-row gap-8'>
          {/* Form Section */}
          <div className='w-full md:w-1/2 bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-2xl font-bold mb-6'>Spa Information</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-1'>Spa Name</label>
                <input name='spa_name' value={formData?.spa_name} onChange={handleChange} className='w-full p-2 border rounded-md' />
                {errors?.spa_name && <span className='text-red-500 text-sm'>{errors?.spa_name}</span>}
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>City</label>
                <input name='city' value={formData.city} onChange={handleChange} className='w-full p-2 border rounded-md' />
                {errors?.city && <span className='text-red-500 text-sm'>{errors?.city}</span>}
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>Area</label>
                <input name='area' value={formData?.area} onChange={handleChange} className='w-full p-2 border rounded-md' />
                {errors?.area && <span className='text-red-500 text-sm'>{errors?.area}</span>}
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>Price</label>
                <input
                  type='number'
                  name='price'
                  value={formData?.price}
                  onChange={handleChange}
                  className='w-full p-2 border rounded-md'
                />
                {errors?.price && <span className='text-red-500 text-sm'>{errors?.price}</span>}
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>Timing</label>
                <input
                  type='time'
                  name='timing'
                  value={formData?.timing}
                  onChange={handleChange}
                  className='w-full p-2 border rounded-md'
                />
                {errors?.timing && <span className='text-red-500 text-sm'>{errors?.timing}</span>}
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>Images</label>
                <input type='file' multiple accept='image/*' onChange={handleImageChange} className='w-full p-2 border rounded-md' />
                {/* Preview thumbnails */}
                <div className='mt-2 flex flex-wrap gap-2'>
                  {selectedImages.map((image, index) => (
                    <div key={index} className='relative'>
                      <img src={image.url} alt={`Preview ${index + 1}`} className='w-16 h-16 object-cover rounded' />
                      <button
                        type='button'
                        onClick={() => removeImage(index)}
                        className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center'
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button type='submit' className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors'>
                Submit
              </button>
            </form>
          </div>

          {/* Preview Section */}
          <FormPreview
            formData={formData}
            currentImageIndex={currentImageIndex}
            setCurrentImageIndex={setCurrentImageIndex}
            selectedImages={selectedImages}
          />
        </div>
      </div>
    </div>
  )
}

export default SpaForm
