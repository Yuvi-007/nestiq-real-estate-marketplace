import { useState } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const tabs = ['Buy', 'Rent', 'Sell']
const priceRanges = [
  { label: 'Any budget', minPrice: '', maxPrice: '' },
  { label: 'Under 75L', minPrice: '', maxPrice: '7500000' },
  { label: '75L - 2Cr', minPrice: '7500000', maxPrice: '20000000' },
  { label: '2Cr - 5Cr', minPrice: '20000000', maxPrice: '50000000' },
  { label: 'Above 5Cr', minPrice: '50000000', maxPrice: '' },
]
const propertyTypes = ['', 'Apartment', 'Villa', 'House', 'Plot', 'PG']

function SearchBar() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Buy')
  const [city, setCity] = useState('')
  const [priceRange, setPriceRange] = useState(priceRanges[0])
  const [type, setType] = useState('')

  const handleSearch = () => {
    if (activeTab === 'Sell') {
      navigate('/dashboard/seller')
      return
    }

    const params = new URLSearchParams()
    if (city.trim()) params.set('city', city.trim())
    if (priceRange.minPrice) params.set('minPrice', priceRange.minPrice)
    if (priceRange.maxPrice) params.set('maxPrice', priceRange.maxPrice)
    if (type) params.set('type', type)
    params.set('mode', activeTab.toLowerCase())

    navigate(`/properties?${params.toString()}`)
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        handleSearch()
      }}
      className="rounded-2xl border border-white/20 bg-white/15 p-3 shadow-2xl backdrop-blur-xl"
    >
      <div className="flex flex-wrap gap-2 border-b border-white/15 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-5 py-2 text-sm font-bold transition ${
              activeTab === tab ? 'bg-accent text-primary' : 'text-white hover:bg-white/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid gap-3 pt-4 md:grid-cols-[1.2fr_1fr_1fr_auto]">
        <input
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="Search city or location"
          className="min-w-0 rounded-xl border border-white/20 bg-white/90 px-4 py-3 text-sm font-semibold text-primary outline-none placeholder:text-slate-500 focus:border-accent"
          aria-label="Search city or location"
        />
        <select
          value={priceRange.label}
          onChange={(event) => {
            const nextRange = priceRanges.find((range) => range.label === event.target.value)
            setPriceRange(nextRange || priceRanges[0])
          }}
          className="min-w-0 rounded-xl border border-white/20 bg-white/90 px-4 py-3 text-sm font-semibold text-primary outline-none focus:border-accent"
          aria-label="Price range"
        >
          {priceRanges.map((range) => (
            <option key={range.label} value={range.label}>{range.label}</option>
          ))}
        </select>
        <select
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="min-w-0 rounded-xl border border-white/20 bg-white/90 px-4 py-3 text-sm font-semibold text-primary outline-none focus:border-accent"
          aria-label="Property type"
        >
          {propertyTypes.map((item) => (
            <option key={item || 'all'} value={item}>
              {item || 'All property types'}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-extrabold text-primary shadow-lg transition hover:bg-amber-400"
        >
          <Search size={18} />
          Search
        </button>
      </div>
    </form>
  )
}

export default SearchBar
