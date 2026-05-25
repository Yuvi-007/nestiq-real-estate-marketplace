import { Car, Dog, Dumbbell, Home, PiggyBank, Sofa, UsersRound, Waves } from 'lucide-react'

import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'
import DiscoveryCategoryCard from './DiscoveryCategoryCard'

const rentalCategories = [
  {
    icon: Home,
    title: 'Nearby rentals',
    description: 'Browse rentals by city or locality and compare commute-friendly options.',
    to: '/properties?mode=rent',
  },
  {
    icon: Car,
    title: 'Rentals with parking',
    description: 'Find homes that list parking or covered parking amenities.',
    to: '/properties?mode=rent&amenities=Parking',
  },
  {
    icon: Dog,
    title: 'Pet-friendly rentals',
    description: 'Start with listings that mention pet-friendly living.',
    to: '/properties?mode=rent&amenities=Pet-friendly',
  },
  {
    icon: Sofa,
    title: 'Furnished rentals',
    description: 'Shortlist furnished homes for faster move-in planning.',
    to: '/properties?mode=rent&furnishing=Furnished',
  },
  {
    icon: UsersRound,
    title: 'PG / room rentals',
    description: 'Explore PG and shared-room style options.',
    to: '/properties?mode=rent&type=PG',
  },
  {
    icon: Dumbbell,
    title: 'Gym or pool',
    description: 'Look for amenity-rich rentals with gym or pool access.',
    to: '/properties?mode=rent&amenities=Gym,Pool',
  },
  {
    icon: PiggyBank,
    title: 'Budget rentals',
    description: 'Browse lower-budget rentals and compare total monthly fit.',
    to: '/properties?mode=rent&maxPrice=50000',
  },
  {
    icon: Waves,
    title: 'Pool rentals',
    description: 'Find rentals that mention pool access in amenities.',
    to: '/properties?mode=rent&amenities=Pool',
  },
]

function RentalCategoryGrid() {
  return (
    <Card>
      <SectionHeader
        eyebrow="Rental discovery"
        title="Start with the rental type you need"
        description="Use quick categories to open filtered marketplace searches without changing any backend logic."
      />
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {rentalCategories.map((category) => (
          <DiscoveryCategoryCard key={category.title} {...category} />
        ))}
      </div>
    </Card>
  )
}

export default RentalCategoryGrid
