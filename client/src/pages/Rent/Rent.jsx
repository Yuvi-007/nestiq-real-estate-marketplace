import { Link } from 'react-router-dom'
import { CalendarDays, Car, Dog, Dumbbell, Sofa, UsersRound } from 'lucide-react'

import ServiceHero from '../../components/common/ServiceHero'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import SectionHeader from '../../components/ui/SectionHeader'

const categories = [
  [Dog, 'Pet-friendly rentals', '/properties?mode=rent&amenities=Pet-friendly'],
  [Sofa, 'Furnished rentals', '/properties?mode=rent&furnishing=Furnished'],
  [UsersRound, 'PG / room rentals', '/properties?mode=rent&type=PG'],
  [Car, 'Rentals with parking', '/properties?mode=rent&amenities=Parking'],
  [Dumbbell, 'Rentals with gym/pool', '/properties?mode=rent&amenities=Gym,Pool'],
]

function Rent() {
  return (
    <section className="space-y-10">
      <ServiceHero
        eyebrow="Rent smarter"
        title="Find rentals that fit your lifestyle"
        description="Search rental homes, PGs, furnished apartments, and amenity-rich properties with transparent listing quality signals."
        mode="rent"
        primaryAction={<Button as={Link} to="/properties?mode=rent" variant="accent">Browse rentals</Button>}
      />

      <Card>
        <SectionHeader eyebrow="Rental categories" title="Start with what matters most" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map(([Icon, title, to]) => (
            <Link key={title} to={to} className="rounded-2xl border border-slate-200 bg-surface p-5 transition hover:border-accent hover:bg-accent/10">
              <Icon className="text-accent" size={24} />
              <p className="mt-4 text-base font-extrabold text-primary">{title}</p>
            </Link>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeader
          eyebrow="Visit planning"
          title="Schedule visits from property details"
          description="Once you find a rental, open the detail page to contact the agent or schedule a visit. Visit requests stay available in your buyer dashboard."
        />
        <div className="mt-5 rounded-2xl bg-surface p-5">
          <CalendarDays className="text-accent" size={26} />
          <p className="mt-4 text-lg font-extrabold text-primary">Keep rental follow-ups organized</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Saved homes, inquiries, and scheduled visits help buyers manage rental decisions in one workspace.</p>
        </div>
      </Card>
    </section>
  )
}

export default Rent
