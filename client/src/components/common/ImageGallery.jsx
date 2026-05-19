import { useState } from 'react'

const fallbackImage =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80'

function ImageGallery({ images = [], title }) {
  const galleryImages = images.length > 0 ? images : [fallbackImage]
  const primaryImage = galleryImages[0]
  const [selectedImage, setSelectedImage] = useState('')
  const activeImage = galleryImages.includes(selectedImage) ? selectedImage : primaryImage

  return (
    <section className="space-y-4">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
        <img src={activeImage} alt={title} className="h-full w-full object-cover" />
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {galleryImages.map((image) => (
          <button
            key={image}
            type="button"
            onClick={() => setSelectedImage(image)}
            className={`h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-100 ${
              activeImage === image ? 'border-accent' : 'border-transparent'
            }`}
            aria-label="View property image"
          >
            <img src={image} alt={title} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </section>
  )
}

export default ImageGallery
