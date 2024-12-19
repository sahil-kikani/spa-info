import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

function FormPreview({ formData, selectedImages, currentImageIndex, setCurrentImageIndex}) {
  return (
    <div className='w-full md:w-1/2 bg-white rounded-lg shadow-md p-6'>
      <h2 className='text-2xl font-bold mb-6'>Live Preview</h2>
      <div className='space-y-4'>
        <div>
          <h3 className='font-medium'>Spa Name:</h3>
          <p>{formData?.spa_name || 'Not specified'}</p>
        </div>
        <div>
          <h3 className='font-medium'>City:</h3>
          <p>{formData?.city || 'Not specified'}</p>
        </div>
        <div>
          <h3 className='font-medium'>Area:</h3>
          <p>{formData?.area || 'Not specified'}</p>
        </div>
        <div>
          <h3 className='font-medium'>Price:</h3>
          <p>{formData?.price ? `₹${formData.price}` : 'Not specified'}</p>
        </div>
        <div>
          <h3 className='font-medium'>Timing:</h3>
          <p>{formData?.timing || 'Not specified'}</p>
        </div>

        {selectedImages.length > 0 && (
                <div className="relative">
                  <h3 className="font-medium mb-2">Images:</h3>
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <img
                      src={selectedImages[currentImageIndex].url}
                      alt={`Preview ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center p-2 bg-black bg-opacity-50">
                      <div className="flex space-x-2">
                        {selectedImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full ${
                              index === currentImageIndex ? 'bg-white' : 'bg-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {selectedImages.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex(prev => 
                            prev === 0 ? selectedImages.length - 1 : prev - 1
                          )}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex(prev => 
                            prev === selectedImages.length - 1 ? 0 : prev + 1
                          )}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
      </div>
    </div>
  )
}

export default FormPreview
