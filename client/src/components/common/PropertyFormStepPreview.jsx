import { MapPin } from 'lucide-react'

import { formatPrice } from '../../utils/formatPrice'

const fallbackImage =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'

function PropertyFormStepPreview({ values }) {
  const images = (values.imagesText || '')
    .split('\n')
    .map((url) => url.trim())
    .filter(Boolean)
  const image = images[0] || fallbackImage

  return (
    <div className="grid gap-5">
      <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="aspect-[16/9] bg-slate-100">
          <img src={image} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="p-5">
          <p className="text-2xl font-extrabold text-primary">{formatPrice(values.price)}</p>
          <h3 className="mt-2 text-xl font-extrabold text-charcoal">{values.title || 'Property title'}</h3>
          <p className="mt-3 flex gap-2 text-sm text-slate-600">
            <MapPin size={17} className="mt-0.5 shrink-0 text-accent" />
            <span>{values.location?.city || 'City'} - {values.location?.address || 'Address'}</span>
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-600">{values.description || 'Property description preview.'}</p>
        </div>
      </article>
    </div>
  )
}

export default PropertyFormStepPreview
