import { useState } from 'react'

import ImageLightbox from './ImageLightbox'

const fallbackImage =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80'

const categories = ['All', 'Exterior', 'Interior', 'Living', 'Kitchen', 'Bedroom', 'Documents']
const demoCategoryOrder = ['Exterior', 'Interior', 'Living', 'Kitchen', 'Bedroom', 'Documents']

const getGalleryImages = (images) => {
  const imageList = images.length > 0 ? images : [fallbackImage]

  return imageList.map((image, index) => ({
    src: image,
    category: demoCategoryOrder[index % demoCategoryOrder.length],
  }))
}

function ImageGallery({ images = [], title }) {
  const galleryImages = getGalleryImages(images)
  const primaryImage = galleryImages[0]
  const [selectedImage, setSelectedImage] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const filteredImages =
    activeCategory === 'All'
      ? galleryImages
      : galleryImages.filter((image) => image.category === activeCategory)
  const visibleImages = filteredImages.length > 0 ? filteredImages : galleryImages
  const activeImage = visibleImages.find((image) => image.src === selectedImage) || visibleImages[0] || primaryImage

  const openLightbox = (image) => {
    const index = visibleImages.findIndex((item) => item.src === image.src)
    setLightboxIndex(index >= 0 ? index : 0)
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
  }

  const showNextImage = () => {
    setLightboxIndex((index) => (index === null ? 0 : (index + 1) % visibleImages.length))
  }

  const showPreviousImage = () => {
    setLightboxIndex((index) => (index === null ? 0 : (index - 1 + visibleImages.length) % visibleImages.length))
  }

  return (
    <section className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => {
              setActiveCategory(category)
              setSelectedImage('')
            }}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-extrabold transition ${
              activeCategory === category
                ? 'border-primary bg-primary text-white'
                : 'border-slate-200 bg-white text-charcoal hover:border-accent'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
        <button type="button" onClick={() => openLightbox(activeImage)} className="block h-full w-full" aria-label="Open image gallery">
          <img src={activeImage.src} alt={title} className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]" />
        </button>
        <span className="absolute bottom-4 left-4 rounded-full bg-primary/85 px-3 py-1 text-xs font-extrabold text-white backdrop-blur">
          {activeImage.category}
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {visibleImages.map((image) => (
          <button
            key={`${image.src}-${image.category}`}
            type="button"
            onClick={() => setSelectedImage(image.src)}
            className={`h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-100 ${
              activeImage.src === image.src ? 'border-accent' : 'border-transparent'
            }`}
            aria-label="View property image"
          >
            <img src={image.src} alt={title} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={visibleImages}
          activeIndex={lightboxIndex}
          title={title}
          onClose={closeLightbox}
          onNext={showNextImage}
          onPrevious={showPreviousImage}
        />
      )}
    </section>
  )
}

export default ImageGallery
