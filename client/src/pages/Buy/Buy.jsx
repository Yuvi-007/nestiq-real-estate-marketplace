import { BadgeCheck, Building2, Castle, Home, MapPinned, ShieldCheck, Sparkles, UsersRound } from 'lucide-react'

import BuyRentHero from '../../components/common/BuyRentHero'
import DiscoveryCategoryCard from '../../components/common/DiscoveryCategoryCard'
import ListingCarouselSection from '../../components/common/ListingCarouselSection'
import MarketGuideCard from '../../components/common/MarketGuideCard'
import Card from '../../components/ui/Card'
import SectionHeader from '../../components/ui/SectionHeader'
import { useProperties } from '../../hooks/useProperties'

const cities = ['Mumbai', 'Pune', 'Bangalore', 'Hyderabad', 'Goa', 'Gurgaon']

const byNewest = (a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0)

const hasAmenity = (property, keyword) => (
  (property.amenities || []).some((amenity) => amenity.toLowerCase().includes(keyword.toLowerCase()))
)

const isVerified = (property) => {
  const status = (property.verification?.status || '').toLowerCase()
  return status === 'approved' || status === 'verified' || Boolean(property.agent)
}

function Buy() {
  const { data, isLoading } = useProperties({ page: 1, limit: 50, sort: 'latest' })
  const properties = data?.data || []
  const recentProperties = [...properties].sort(byNewest)

  const featuredHomes = properties.slice(0, 6)
  const verifiedProperties = properties.filter(isVerified).slice(0, 6)
  const homesUnderOneCr = properties.filter((property) => Number(property.price || 0) <= 10000000).slice(0, 6)
  const luxuryVillas = properties
    .filter((property) => property.type === 'Villa' || Number(property.price || 0) >= 50000000)
    .slice(0, 6)
  const familyHomes = properties
    .filter((property) => Number(property.bhk || 0) >= 3 || hasAmenity(property, 'security') || hasAmenity(property, 'parking'))
    .slice(0, 6)

  return (
    <section className="space-y-8">
      <BuyRentHero
        mode="buy"
        title="Find homes for sale with clearer confidence signals"
        subtitle="Browse verified listings, compare Trust Score signals, and open property details before contacting an agent."
      />

      <ListingCarouselSection
        title="Featured homes for sale"
        subtitle="A quick look at current NestIQ marketplace inventory."
        properties={featuredHomes}
        isLoading={isLoading}
        viewAllTo="/properties?mode=buy"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [Building2, 'Apartments', 'Browse flats and apartments in popular cities.', '/properties?mode=buy&type=Apartment'],
          [Castle, 'Luxury villas', 'Explore larger homes and villa-style listings.', '/properties?mode=buy&type=Villa'],
          [Sparkles, 'Under Rs. 1Cr', 'Start with budget-conscious homes for sale.', '/properties?mode=buy&maxPrice=10000000'],
          [UsersRound, 'Family-friendly', 'Look for 3+ BHK homes and practical amenities.', '/properties?mode=buy&bhk=3'],
        ].map(([Icon, title, description, to]) => (
          <DiscoveryCategoryCard key={title} icon={Icon} title={title} description={description} to={to} />
        ))}
      </div>

      <ListingCarouselSection
        title="Verified properties"
        subtitle="Listings with verification or agent confidence signals."
        properties={verifiedProperties}
        isLoading={isLoading}
        viewAllTo="/properties?mode=buy&verifiedOnly=true"
      />

      <ListingCarouselSection
        title="Homes under Rs. 1Cr"
        subtitle="Budget-focused homes using the existing listing price data."
        properties={homesUnderOneCr}
        isLoading={isLoading}
        viewAllTo="/properties?mode=buy&maxPrice=10000000"
      />

      <ListingCarouselSection
        title="Luxury villas"
        subtitle="Villa and premium-price listings for larger-home discovery."
        properties={luxuryVillas}
        isLoading={isLoading}
        viewAllTo="/properties?mode=buy&type=Villa"
      />

      <ListingCarouselSection
        title="Family-friendly homes"
        subtitle="Homes with larger BHK counts or practical everyday amenities."
        properties={familyHomes}
        isLoading={isLoading}
        viewAllTo="/properties?mode=buy&bhk=3"
      />

      <ListingCarouselSection
        title="Recently added"
        subtitle="Newer marketplace listings sorted on available listing dates."
        properties={recentProperties.slice(0, 6)}
        isLoading={isLoading}
        viewAllTo="/properties?mode=buy&sort=latest"
      />

      <Card>
        <SectionHeader eyebrow="Popular cities" title="Explore homes by city" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <DiscoveryCategoryCard
              key={city}
              icon={MapPinned}
              title={city}
              description="Browse sale listings and compare Trust Score signals."
              to={`/properties?mode=buy&city=${city}`}
            />
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeader
          eyebrow="Buying guides"
          title="Market tips before shortlisting"
          description="Simple guidance cards that keep discovery useful without pretending to be live market advice."
        />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <MarketGuideCard icon={Home} title="Compare the full cost" description="Look beyond price: maintenance, registration, parking, repairs, and commute can change the decision." />
          <MarketGuideCard icon={BadgeCheck} title="Check verification" description="Review verification status, ownership documents, agent info, and site visit findings before token payment." to="/properties?mode=buy&verifiedOnly=true" />
          <MarketGuideCard icon={ShieldCheck} title="Use Trust Score" description="Trust Score explains listing quality, price fairness, media quality, agent signals, and risk warnings." />
        </div>
      </Card>

      <Card>
        <SectionHeader
          eyebrow="Trust intelligence"
          title="Why buyers use NestIQ Trust Score"
          description="Trust Score is a rule-based listing analysis tool for demo purposes, not a legal or valuation guarantee."
        />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            [ShieldCheck, 'Risk labels', 'LOW, MEDIUM, or HIGH risk labels help you inspect listings faster.'],
            [BadgeCheck, 'Transparent strengths', 'See what makes a listing more complete before contacting the agent.'],
            [Building2, 'Better comparison', 'Compare price, media, location, amenities, and verification signals.'],
          ].map(([Icon, title, text]) => (
            <div key={title} className="rounded-2xl bg-surface p-5">
              <Icon className="text-accent" size={24} />
              <h3 className="mt-4 text-lg font-extrabold text-primary">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </Card>
    </section>
  )
}

export default Buy
