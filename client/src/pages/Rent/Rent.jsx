import { Link } from 'react-router-dom'
import { CalendarDays, Car, Dog, Dumbbell, Home, PiggyBank, Sofa, UsersRound } from 'lucide-react'

import BuyRentHero from '../../components/common/BuyRentHero'
import ListingCarouselSection from '../../components/common/ListingCarouselSection'
import MarketGuideCard from '../../components/common/MarketGuideCard'
import RentalCategoryGrid from '../../components/common/RentalCategoryGrid'
import Card from '../../components/ui/Card'
import SectionHeader from '../../components/ui/SectionHeader'
import { useProperties } from '../../hooks/useProperties'

const byNewest = (a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0)

const hasAmenity = (property, keyword) => (
  (property.amenities || []).some((amenity) => amenity.toLowerCase().includes(keyword.toLowerCase()))
)

const hasFurnishing = (property, keyword) => (
  (property.furnishing || '').toLowerCase().includes(keyword.toLowerCase())
)

function Rent() {
  const { data, isLoading } = useProperties({ page: 1, limit: 50, sort: 'latest' })
  const properties = data?.data || []
  const recentProperties = [...properties].sort(byNewest)

  const nearbyRentals = properties.slice(0, 6)
  const parkingRentals = properties.filter((property) => hasAmenity(property, 'parking')).slice(0, 6)
  const petFriendlyRentals = properties.filter((property) => hasAmenity(property, 'pet')).slice(0, 6)
  const furnishedRentals = properties.filter((property) => hasFurnishing(property, 'furnished')).slice(0, 6)
  const pgRentals = properties.filter((property) => property.type === 'PG').slice(0, 6)
  const gymPoolRentals = properties
    .filter((property) => hasAmenity(property, 'gym') || hasAmenity(property, 'pool'))
    .slice(0, 6)
  const budgetRentals = properties.filter((property) => Number(property.price || 0) <= 50000).slice(0, 6)

  return (
    <section className="space-y-8">
      <BuyRentHero
        mode="rent"
        title="Find rentals that match your daily life"
        subtitle="Browse furnished homes, PGs, parking-friendly rentals, and amenity-rich listings with clear property signals."
        searchPlaceholder="Search rentals by city, locality, or project"
      />

      <RentalCategoryGrid />

      <ListingCarouselSection
        title="Nearby rentals"
        subtitle="Start with available marketplace listings, then narrow by city or locality."
        properties={nearbyRentals}
        isLoading={isLoading}
        viewAllTo="/properties?mode=rent"
      />

      <ListingCarouselSection
        title="Rentals with parking"
        subtitle="Listings that mention parking-related amenities."
        properties={parkingRentals}
        isLoading={isLoading}
        viewAllTo="/properties?mode=rent&amenities=Parking"
      />

      <ListingCarouselSection
        title="Pet-friendly rentals"
        subtitle="Rental discovery for homes that mention pet-friendly signals."
        properties={petFriendlyRentals}
        isLoading={isLoading}
        viewAllTo="/properties?mode=rent&amenities=Pet-friendly"
      />

      <ListingCarouselSection
        title="Furnished rentals"
        subtitle="Move-in-friendly listings with furnished status."
        properties={furnishedRentals}
        isLoading={isLoading}
        viewAllTo="/properties?mode=rent&furnishing=Furnished"
      />

      <ListingCarouselSection
        title="PG / room rentals"
        subtitle="PG-style listings when available in the marketplace."
        properties={pgRentals}
        isLoading={isLoading}
        viewAllTo="/properties?mode=rent&type=PG"
      />

      <ListingCarouselSection
        title="Rentals with gym or pool"
        subtitle="Amenity-rich rentals for lifestyle-led browsing."
        properties={gymPoolRentals}
        isLoading={isLoading}
        viewAllTo="/properties?mode=rent&amenities=Gym,Pool"
      />

      <ListingCarouselSection
        title="Budget rentals"
        subtitle="Lower monthly-price options when available in listing data."
        properties={budgetRentals}
        isLoading={isLoading}
        viewAllTo="/properties?mode=rent&maxPrice=50000"
      />

      <ListingCarouselSection
        title="Recently added rentals"
        subtitle="Newer marketplace listings sorted by available listing dates."
        properties={recentProperties.slice(0, 6)}
        isLoading={isLoading}
        viewAllTo="/properties?mode=rent&sort=latest"
      />

      <Card>
        <SectionHeader
          eyebrow="Rental guide"
          title="Plan visits and compare rentals clearly"
          description="These guide cards use demo guidance only. Verify exact rent, deposit, maintenance, restrictions, and lease terms with the agent or owner."
        />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <MarketGuideCard icon={CalendarDays} title="Schedule visits" description="Open a rental detail page to contact the agent or request a visit from your account." to="/properties?mode=rent" />
          <MarketGuideCard icon={PiggyBank} title="Check total monthly cost" description="Compare rent, deposit, maintenance, parking, utilities, and commute costs before shortlisting." to="/properties?mode=rent&maxPrice=50000" />
          <MarketGuideCard icon={Home} title="Match lifestyle fit" description="Use nearby insights, amenities, furnishing, and property facts to compare real daily convenience." to="/properties?mode=rent" />
        </div>
      </Card>

      <Card>
        <SectionHeader eyebrow="Quick rental filters" title="Common rental shortcuts" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [Sofa, 'Furnished', '/properties?mode=rent&furnishing=Furnished'],
            [Car, 'Parking', '/properties?mode=rent&amenities=Parking'],
            [Dog, 'Pet-friendly', '/properties?mode=rent&amenities=Pet-friendly'],
            [UsersRound, 'PG homes', '/properties?mode=rent&type=PG'],
            [Dumbbell, 'Gym', '/properties?mode=rent&amenities=Gym'],
            [Home, 'Apartments', '/properties?mode=rent&type=Apartment'],
            [PiggyBank, 'Budget', '/properties?mode=rent&maxPrice=50000'],
            [CalendarDays, 'Recently added', '/properties?mode=rent&sort=latest'],
          ].map(([Icon, title, to]) => (
            <Link key={title} to={to} className="rounded-2xl border border-slate-200 bg-surface p-4 transition hover:border-accent hover:bg-accent/10">
              <Icon className="text-accent" size={22} />
              <p className="mt-3 text-sm font-extrabold text-primary">{title}</p>
            </Link>
          ))}
        </div>
      </Card>
    </section>
  )
}

export default Rent
