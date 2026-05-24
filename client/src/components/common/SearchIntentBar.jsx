const intents = [
  { label: 'Buy', patch: { mode: 'buy', type: '' } },
  { label: 'Rent', patch: { mode: 'rent', type: '' } },
  { label: 'PG', patch: { mode: 'rent', type: 'PG' } },
  { label: 'Luxury', patch: { q: 'luxury', minPrice: '20000000' } },
  { label: 'Verified', patch: { verifiedOnly: true } },
  { label: 'New listings', patch: { sort: 'latest' } },
]

function SearchIntentBar({ filters, onApply }) {
  const isActive = (intent) => Object.entries(intent.patch).every(([key, value]) => filters[key] === value)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="flex gap-2 overflow-x-auto overscroll-x-contain">
        {intents.map((intent) => (
          <button
            key={intent.label}
            type="button"
            onClick={() => onApply({ ...filters, ...intent.patch })}
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-extrabold transition ${
              isActive(intent) ? 'bg-primary text-white' : 'text-charcoal hover:bg-surface hover:text-primary'
            }`}
          >
            {intent.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SearchIntentBar
