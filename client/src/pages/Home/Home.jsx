import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

import CTASection from '../../components/common/CTASection'
import CityMarquee from '../../components/common/CityMarquee'
import FeaturedListings from '../../components/common/FeaturedListings'
import HowItWorks from '../../components/common/HowItWorks'
import NeighborhoodSpotlight from '../../components/common/NeighborhoodSpotlight'
import PopularSearches from '../../components/common/PopularSearches'
import RecentSearches from '../../components/common/RecentSearches'
import RecommendationQuiz from '../../components/common/RecommendationQuiz'
import SearchBar from '../../components/common/SearchBar'
import StatsSection from '../../components/common/StatsSection'
import Testimonials from '../../components/common/Testimonials'
import Button from '../../components/ui/Button'
import { useProperties } from '../../hooks/useProperties'

const topCities = [
  ['Mumbai', 'mumbai', 'Sea-view apartments and luxury towers'],
  ['Pune', 'pune', 'IT corridors and gated communities'],
  ['Goa', 'goa', 'Beachside villas and lifestyle homes'],
  ['Bangalore', 'bangalore', 'Tech-led residential markets'],
]

function ExploreTopCities() {
  return (
    <section className="bg-surface px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase text-accent">Explore top cities</p>
          <h2 className="mt-3 font-display text-4xl font-bold text-primary">City guides for high-intent markets</h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Market insights are demo estimates for project presentation.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {topCities.map(([city, slug, text]) => (
            <Link key={slug} to={`/city/${slug}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-accent hover:shadow-xl">
              <p className="text-2xl font-extrabold text-primary">{city}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              <span className="mt-5 inline-flex text-sm font-extrabold text-accent">View city guide</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function Home() {
  const [isQuizOpen, setIsQuizOpen] = useState(false)
  const { data } = useProperties({ limit: 50 })
  const properties = data?.data || []

  return (
    <div>
      <section
        className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-primary"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=85')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-primary/20" />

        <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl"
          >
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-accent">Premium verified real estate</p>
            <h1 className="mt-6 font-display text-5xl font-bold leading-tight text-white sm:text-7xl lg:text-8xl">
              Find Your{' '}
              <span className="bg-gradient-to-r from-accent via-yellow-200 to-accent bg-clip-text text-transparent">
                Perfect Home
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
              Discover premium verified properties across India with trusted agents, rich details, and smart market
              insights built for confident decisions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-10 max-w-5xl space-y-4"
          >
            <SearchBar />
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">
              <Button variant="accent" icon={Sparkles} onClick={() => setIsQuizOpen(true)}>
                Find My Best Property
              </Button>
              <p className="text-sm font-semibold text-slate-200">
                Answer a short rule-based quiz and see listings with match scores.
              </p>
            </div>
            <PopularSearches compact />
            <RecentSearches compact />
          </motion.div>
        </div>
      </section>

      <CityMarquee />
      <ExploreTopCities />
      <StatsSection />
      <FeaturedListings />
      <HowItWorks />
      <NeighborhoodSpotlight />
      <Testimonials />
      <CTASection />
      <RecommendationQuiz
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        properties={properties}
      />
    </div>
  )
}

export default Home
