import { CheckCircle2 } from 'lucide-react'

function AmenitiesGrid({ amenities = [] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-primary">Amenities</h2>

      {amenities.length === 0 ? (
        <p className="mt-4 text-sm text-slate-600">Amenities are not listed for this property yet.</p>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {amenities.map((amenity) => (
            <div key={amenity} className="flex items-center gap-3 rounded-lg bg-surface px-4 py-3 text-sm font-semibold text-charcoal">
              <CheckCircle2 size={18} className="text-success" />
              <span>{amenity}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default AmenitiesGrid
