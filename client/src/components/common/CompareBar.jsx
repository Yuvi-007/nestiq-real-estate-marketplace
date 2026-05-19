import { X } from 'lucide-react'
import { motion } from 'framer-motion'

function CompareBar({ properties, onRemove, onClear }) {
  if (properties.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ y: 90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed inset-x-3 bottom-20 z-[60] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl md:bottom-5"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-extrabold text-primary">Compare properties ({properties.length}/3)</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {properties.map((property) => (
              <span
                key={property._id}
                className="inline-flex max-w-xs items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-xs font-bold text-charcoal"
              >
                <span className="truncate">{property.title}</span>
                <button type="button" onClick={() => onRemove(property._id)} aria-label={`Remove ${property.title}`}>
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={onClear} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-primary">
            Clear
          </button>
          <button type="button" className="rounded-xl bg-accent px-5 py-2 text-sm font-extrabold text-primary">
            Compare
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default CompareBar
