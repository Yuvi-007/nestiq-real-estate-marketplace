import { ArrowRight, MapPin, Search } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import CityFeaturedProperties from '../../components/common/CityFeaturedProperties'
import CityLifestyleSummary from '../../components/common/CityLifestyleSummary'
import CityMarketSnapshot from '../../components/common/CityMarketSnapshot'
import CityPopularSearches from '../../components/common/CityPopularSearches'
import CityPropertyTypeBreakdown from '../../components/common/CityPropertyTypeBreakdown'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import SectionHeader from '../../components/ui/SectionHeader'
import { citySlugList, getCityLanding } from '../../utils/cityLandingData'

function CityLanding() {
  const { citySlug } = useParams()
  const city = getCityLanding(citySlug)

  if (!city) {
    return (
      <EmptyState
        title="City page not available"
        description="This NestIQ city guide is not published yet. Explore one of the supported city pages instead."
        actionLabel="Browse properties"
        actionTo="/properties"
      />
    )
  }

  return (
    <section className="space-y-10">
      <div className="overflow-hidden rounded-2xl bg-primary shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <div className="grid gap-6 p-6 text-white md:p-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-10">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-accent">
              <MapPin size={17} />
              NestIQ city guide
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-6xl">
              Homes for sale in {city.name}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75">{city.tagline}</p>
            <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-white/60">
              Market insights are demo estimates for project presentation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button as={Link} to={`/properties?city=${city.name}`} variant="accent" icon={Search}>
                Browse {city.name} Properties
              </Button>
              <Button as={Link} to={`/properties?city=${city.name}&sort=latest`} variant="secondary" className="bg-white">
                New listings
              </Button>
            </div>
          </div>

          <Card className="bg-white/95">
            <p className="text-sm font-extrabold uppercase text-accent">Market pulse</p>
            <p className="mt-3 text-3xl font-extrabold text-primary">{city.averagePrice}</p>
            <p className="mt-1 text-sm font-semibold text-slate-600">Average city price estimate</p>
            <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-700">
              <p>Demand: <span className="font-extrabold text-primary">{city.demandLevel}</span></p>
              <p>Investment score: <span className="font-extrabold text-primary">{city.investmentScore}/100</span></p>
              <p>Lifestyle score: <span className="font-extrabold text-primary">{city.lifestyleScore}/100</span></p>
            </div>
          </Card>
        </div>
      </div>

      <CityMarketSnapshot city={city} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <CityPopularSearches city={city} />
          <CityFeaturedProperties cityName={city.name} />
          <CityLifestyleSummary city={city} />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <CityPropertyTypeBreakdown city={city} />

          <Card>
            <SectionHeader eyebrow="Popular localities" title={`Where buyers search in ${city.name}`} className="[&_h2]:text-xl" />
            <div className="mt-5 flex flex-wrap gap-2">
              {city.topLocalities.map((locality) => (
                <Link
                  key={locality}
                  to={`/properties?city=${city.name}&q=${encodeURIComponent(locality)}`}
                  className="rounded-full border border-slate-200 bg-surface px-4 py-2 text-sm font-extrabold text-charcoal transition hover:border-accent hover:bg-accent/10 hover:text-primary"
                >
                  {locality}
                </Link>
              ))}
            </div>
          </Card>

          <Card className="bg-primary text-white">
            <p className="text-sm font-extrabold uppercase tracking-wide text-accent">City search</p>
            <h2 className="mt-3 text-2xl font-extrabold">Track {city.name} listings</h2>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Browse the city inventory and save the search from the marketplace for local demo alerts.
            </p>
            <Button as={Link} to={`/properties?city=${city.name}`} variant="accent" icon={ArrowRight} iconPosition="right" className="mt-5">
              Open city search
            </Button>
          </Card>
        </aside>
      </div>

      <Card>
        <SectionHeader
          eyebrow="More city guides"
          title="Explore other NestIQ markets"
          description="SEO-style city guides can scale as the platform adds more local inventory and verified market data."
        />
        <div className="mt-5 flex flex-wrap gap-2">
          {citySlugList.map((slug) => {
            const item = getCityLanding(slug)
            return (
              <Link
                key={slug}
                to={`/city/${slug}`}
                className="rounded-full border border-slate-200 bg-surface px-4 py-2 text-sm font-extrabold text-charcoal transition hover:border-accent hover:bg-accent/10 hover:text-primary"
              >
                {item.name}
              </Link>
            )
          })}
        </div>
      </Card>
    </section>
  )
}

export default CityLanding
