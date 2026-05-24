import { Link } from 'react-router-dom'
import { BadgeCheck, Building2, MapPinned, ShieldCheck } from 'lucide-react'

import FeaturedListings from '../../components/common/FeaturedListings'
import PopularSearches from '../../components/common/PopularSearches'
import ServiceHero from '../../components/common/ServiceHero'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import SectionHeader from '../../components/ui/SectionHeader'

const cities = ['Mumbai', 'Pune', 'Bangalore', 'Hyderabad', 'Goa', 'Gurgaon']
const buyerSearches = [
  { label: 'Ready-to-move homes', params: { mode: 'buy', q: 'ready to move' } },
  { label: '3 BHK in Mumbai', params: { mode: 'buy', bhk: '3', city: 'Mumbai' } },
  { label: 'Flats under Rs. 1Cr in Pune', params: { mode: 'buy', type: 'Apartment', city: 'Pune', maxPrice: '10000000' } },
  { label: 'Villas in Goa', params: { mode: 'buy', type: 'Villa', city: 'Goa' } },
  { label: 'High Trust Score homes', params: { mode: 'buy', minTrustScore: '80' } },
  { label: 'Luxury homes in Gurgaon', params: { mode: 'buy', q: 'luxury', city: 'Gurgaon' } },
]

function Buy() {
  return (
    <section className="space-y-10">
      <ServiceHero
        eyebrow="Buy with confidence"
        title="Find homes backed by smarter listing intelligence"
        description="Search verified listings, compare properties, and use NestIQ Trust Score before shortlisting your next home."
        mode="buy"
        searchPlaceholder="Search city, locality, or project"
        primaryAction={<Button as={Link} to="/properties?mode=buy" variant="accent">Browse homes for sale</Button>}
      />

      <PopularSearches searches={buyerSearches} />

      <Card>
        <SectionHeader eyebrow="Top cities" title="Explore homes by city" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <Link key={city} to={`/properties?mode=buy&city=${city}`} className="rounded-2xl border border-slate-200 bg-surface p-5 transition hover:border-accent hover:bg-accent/10">
              <MapPinned className="text-accent" size={22} />
              <p className="mt-4 text-xl font-extrabold text-primary">{city}</p>
              <p className="mt-2 text-sm text-slate-600">Browse sale listings and compare trust signals.</p>
            </Link>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeader
          eyebrow="Trust intelligence"
          title="Why buyers use NestIQ Score"
          description="Every scored listing explains price fairness, completeness, location confidence, media quality, and agent trust."
        />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            [ShieldCheck, 'Risk labels', 'LOW, MEDIUM, or HIGH risk signals help you inspect listings faster.'],
            [BadgeCheck, 'Transparent strengths', 'See what makes a listing trustworthy before contacting the agent.'],
            [Building2, 'Better comparison', 'Smart Compare highlights value, media, location, and trust across selected homes.'],
          ].map(([Icon, title, text]) => (
            <div key={title} className="rounded-2xl bg-surface p-5">
              <Icon className="text-accent" size={24} />
              <h3 className="mt-4 text-lg font-extrabold text-primary">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="-mx-4 sm:-mx-6 lg:-mx-8">
        <FeaturedListings />
      </div>
    </section>
  )
}

export default Buy
