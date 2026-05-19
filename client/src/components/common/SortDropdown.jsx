const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'priceAsc', label: 'Price: Low to High' },
  { value: 'priceDesc', label: 'Price: High to Low' },
  { value: 'views', label: 'Most Viewed' },
]

function SortDropdown({ value, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
      Sort
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-primary outline-none focus:border-accent"
        aria-label="Sort properties"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default SortDropdown
