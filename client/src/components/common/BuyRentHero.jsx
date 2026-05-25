import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Search } from 'lucide-react'

import Button from '../ui/Button'
import Card from '../ui/Card'
import Input from '../ui/Input'

const defaultCities = ['Mumbai', 'Pune', 'Bangalore', 'Hyderabad', 'Goa', 'Gurgaon']

function BuyRentHero({
  mode = 'buy',
  title,
  subtitle,
  searchPlaceholder = 'Search city, locality, or project',
  popularCities = defaultCities,
}) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const modeLabel = mode === 'rent' ? 'rentals' : 'homes'

  const getSearchPath = (params = {}) => {
    const searchParams = new URLSearchParams({ mode, ...params })
    return `/properties?${searchParams.toString()}`
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmedQuery = query.trim()
    navigate(getSearchPath(trimmedQuery ? { q: trimmedQuery } : {}))
  }

  return (
    <Card className="overflow-hidden border-primary/10 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-wide text-accent">
            {mode === 'rent' ? 'Rent smarter' : 'Buy with confidence'}
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight text-primary sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{subtitle}</p>

          <form onSubmit={handleSubmit} className="mt-7 rounded-3xl border border-slate-200 bg-surface p-3">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                icon={Search}
                aria-label={searchPlaceholder}
                className="bg-white"
              />
              <Button type="submit" variant="accent" size="lg" icon={Search}>
                Search
              </Button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wide text-muted">Popular</span>
            {popularCities.map((city) => (
              <Link
                key={city}
                to={getSearchPath({ city })}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-extrabold text-charcoal transition hover:border-accent hover:bg-accent/10 hover:text-primary"
              >
                <MapPin size={13} />
                {city}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-primary p-6 text-white">
          <p className="text-sm font-bold text-white/60">Browse faster</p>
          <p className="mt-3 text-3xl font-extrabold">
            Find {modeLabel} with Trust Score, saved homes, quick view, and comparison tools.
          </p>
          <Button as={Link} to={getSearchPath()} variant="accent" size="lg" className="mt-6 w-full">
            View all {modeLabel}
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default BuyRentHero
