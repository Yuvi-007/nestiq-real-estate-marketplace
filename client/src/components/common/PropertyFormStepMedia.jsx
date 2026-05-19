import { ImagePlus, Trash2, UploadCloud } from 'lucide-react'
import { useState } from 'react'
import { useController, useWatch } from 'react-hook-form'

import { uploadService } from '../../services/api'

const maxImages = 15
const maxImageSize = 5 * 1024 * 1024
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const getErrorMessage = (error) => error.response?.data?.message || error.message || 'Unable to upload images'

function PropertyFormStepMedia({ register, control }) {
  const [uploadError, setUploadError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const uploadedImages = useWatch({ control, name: 'uploadedImages' }) || []
  const { field } = useController({ control, name: 'uploadedImages' })

  const validateFiles = (files) => {
    if (uploadedImages.length + files.length > maxImages) {
      return `You can add a maximum of ${maxImages} images.`
    }

    const invalidType = files.find((file) => !allowedTypes.includes(file.type))
    if (invalidType) {
      return 'Only jpg, jpeg, png, and webp images are allowed.'
    }

    const invalidSize = files.find((file) => file.size > maxImageSize)
    if (invalidSize) {
      return 'Each image must be 5MB or smaller.'
    }

    return ''
  }

  const uploadFiles = async (fileList) => {
    const files = Array.from(fileList || [])

    if (files.length === 0) {
      return
    }

    setUploadError('')

    const validationError = validateFiles(files)
    if (validationError) {
      setUploadError(validationError)
      return
    }

    setIsUploading(true)

    try {
      const response = await uploadService.uploadPropertyImages(files)
      field.onChange([...(field.value || []), ...(response.images || [])])
    } catch (error) {
      setUploadError(getErrorMessage(error))
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (publicId) => {
    field.onChange((field.value || []).filter((image) => image.publicId !== publicId))
  }

  const handleDrop = (event) => {
    event.preventDefault()
    uploadFiles(event.dataTransfer.files)
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-primary">Property images</p>
        <p className="mt-1 text-xs font-semibold text-slate-500">
          Upload up to 15 images. Supported formats: jpg, jpeg, png, webp. Max 5MB each.
        </p>
      </div>

      <label
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-5 py-10 text-center transition ${
          isUploading ? 'border-accent bg-accent/10' : 'border-slate-200 bg-slate-50 hover:border-accent hover:bg-accent/5'
        }`}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
          {isUploading ? <UploadCloud className="animate-pulse" size={22} /> : <ImagePlus size={22} />}
        </span>
        <span className="mt-4 text-sm font-extrabold text-primary">
          {isUploading ? 'Uploading images...' : 'Drag images here or click to browse'}
        </span>
        <span className="mt-1 text-xs font-semibold text-slate-500">Images upload immediately and can be removed before publishing.</span>
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          disabled={isUploading || uploadedImages.length >= maxImages}
          onChange={(event) => {
            uploadFiles(event.target.files)
            event.target.value = ''
          }}
          className="sr-only"
        />
      </label>

      {uploadError && (
        <div className="rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
          {uploadError}
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4">
          {uploadedImages.map((image) => (
            <div key={image.publicId} className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <img src={image.url} alt="Uploaded property" className="aspect-[4/3] w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(image.publicId)}
                className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-danger shadow-md transition hover:bg-danger hover:text-white"
                aria-label="Remove uploaded image"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-bold text-primary" htmlFor="imagesText">
          Advanced: image URLs
        </label>
        <textarea
          id="imagesText"
          {...register('imagesText')}
          rows={5}
          className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-accent focus:ring-4 focus:ring-accent/15"
          placeholder="Optional fallback: paste one image URL per line"
        />
        <p className="mt-2 text-xs font-semibold text-slate-500">
          Manual URLs are still supported and will be added after uploaded images.
        </p>
      </div>
    </div>
  )
}

export default PropertyFormStepMedia
