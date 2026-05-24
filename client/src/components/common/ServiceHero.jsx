import { Search } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '../ui/Button'
import Input from '../ui/Input'

function ServiceHero({
  eyebrow,
  title,
  description,
  mode = 'buy',
  backgroundImage = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=85',
  primaryAction,
  secondaryAction,
  showSearch = true,
  searchPlaceholder = 'Search city or locality',
}) {
  const navigate = useNavigate()
  const [city, setCity] = useState('')

  const handleSearch = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    params.set('mode', mode)
    if (city.trim()) params.set('city', city.trim())
    navigate(`/properties?${params.toString()}`)
  }

  return (
    <section
      className="relative overflow-hidden rounded-2xl bg-primary px-5 py-16 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:px-8 lg:px-10"
      style={{ backgroundImage: `url('${backgroundImage}')`, backgroundPosition: 'center', backgroundSize: 'cover' }}
    >
      <div className="absolute inset-0 bg-primary/80" />
      <div className="relative max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-accent">{eyebrow}</p>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/80">{description}</p>

        {showSearch && (
          <form onSubmit={handleSearch} className="mt-8 grid max-w-3xl gap-3 rounded-2xl bg-white/15 p-3 backdrop-blur md:grid-cols-[minmax(0,1fr)_auto]">
            <Input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder={searchPlaceholder}
              className="bg-white"
              aria-label={searchPlaceholder}
            />
            <Button type="submit" variant="accent" size="lg" icon={Search}>
              Search
            </Button>
          </form>
        )}

        {(primaryAction || secondaryAction) && (
          <div className="mt-5 flex flex-wrap gap-3">
            {primaryAction}
            {secondaryAction}
          </div>
        )}
      </div>
    </section>
  )
}

export default ServiceHero
