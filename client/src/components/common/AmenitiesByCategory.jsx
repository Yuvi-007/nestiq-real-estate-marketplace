import { Car, CheckCircle2, MapPinned, ShieldCheck, Sparkles, Wind } from 'lucide-react'

import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'

const categoryConfig = [
  { title: 'Comfort', icon: Wind, keywords: ['ac', 'air', 'furnished', 'balcony', 'modular', 'lift'], fallback: ['Balcony', 'Lift access', 'Furnished options'] },
  { title: 'Security', icon: ShieldCheck, keywords: ['security', 'cctv', 'gated', 'guard', 'intercom'], fallback: ['Security desk', 'Gated access', 'Visitor entry'] },
  { title: 'Lifestyle', icon: Sparkles, keywords: ['gym', 'pool', 'club', 'garden', 'play', 'park'], fallback: ['Gym / fitness access', 'Community space', 'Open recreation area'] },
  { title: 'Parking & Utilities', icon: Car, keywords: ['parking', 'power', 'backup', 'water', 'gas'], fallback: ['Parking to verify', 'Power backup to verify', 'Water supply to verify'] },
  { title: 'Nearby', icon: MapPinned, keywords: ['school', 'hospital', 'metro', 'market', 'mall'], fallback: ['Schools nearby', 'Daily needs nearby', 'Transit access to verify'] },
]

const groupAmenities = (amenities = []) =>
  categoryConfig.map((category) => {
    const matches = amenities.filter((amenity) => {
      const normalized = String(amenity).toLowerCase()
      return category.keywords.some((keyword) => normalized.includes(keyword))
    })

    return {
      ...category,
      items: matches.length ? matches : category.fallback,
      isFallback: matches.length === 0,
    }
  })

function AmenitiesByCategory({ amenities = [] }) {
  const categories = groupAmenities(amenities)

  return (
    <Card>
      <SectionHeader
        eyebrow="Amenities"
        title="Amenities grouped for faster comparison"
        description={amenities.length ? 'Grouped from the amenities provided in this listing.' : 'Demo categories shown because this listing has not provided detailed amenities yet.'}
      />
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {categories.map((category) => {
          const Icon = category.icon

          return (
            <div key={category.title} className="rounded-2xl border border-slate-200 bg-surface p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-accent">
                  <Icon size={20} />
                </span>
                <div>
                  <h3 className="font-extrabold text-primary">{category.title}</h3>
                  {category.isFallback && <p className="text-xs font-semibold text-slate-500">Demo fallback</p>}
                </div>
              </div>
              <div className="mt-4 grid gap-2">
                {category.items.map((item) => (
                  <p key={item} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <CheckCircle2 size={16} className="shrink-0 text-success" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default AmenitiesByCategory
