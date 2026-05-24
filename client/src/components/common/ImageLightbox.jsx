import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

function ImageLightbox({ images, activeIndex, title, onClose, onNext, onPrevious }) {
  const activeImage = images[activeIndex]

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onNext()
      if (event.key === 'ArrowLeft') onPrevious()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onNext, onPrevious])

  if (!activeImage) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 px-3 py-5 sm:px-4 sm:py-6">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
        aria-label="Close gallery"
      >
        <X size={22} />
      </button>

      <button
        type="button"
        onClick={onPrevious}
        className="absolute left-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20 sm:flex"
        aria-label="Previous image"
      >
        <ChevronLeft size={26} />
      </button>

      <img src={activeImage.src} alt={title} className="max-h-[78vh] max-w-full rounded-2xl object-contain shadow-2xl sm:max-h-[82vh]" />

      <button
        type="button"
        onClick={onNext}
        className="absolute right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20 sm:flex"
        aria-label="Next image"
      >
        <ChevronRight size={26} />
      </button>

      <div className="absolute bottom-4 left-1/2 flex max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur">
        <button type="button" onClick={onPrevious} className="sm:hidden" aria-label="Previous image">
          <ChevronLeft size={20} />
        </button>
        <span className="truncate">
          {activeIndex + 1}/{images.length} - {activeImage.category}
        </span>
        <button type="button" onClick={onNext} className="sm:hidden" aria-label="Next image">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}

export default ImageLightbox
