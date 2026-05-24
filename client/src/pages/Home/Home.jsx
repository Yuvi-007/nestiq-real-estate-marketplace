import { motion } from 'framer-motion'

import CTASection from '../../components/common/CTASection'
import CityMarquee from '../../components/common/CityMarquee'
import FeaturedListings from '../../components/common/FeaturedListings'
import HowItWorks from '../../components/common/HowItWorks'
import NeighborhoodSpotlight from '../../components/common/NeighborhoodSpotlight'
import PopularSearches from '../../components/common/PopularSearches'
import RecentSearches from '../../components/common/RecentSearches'
import SearchBar from '../../components/common/SearchBar'
import StatsSection from '../../components/common/StatsSection'
import Testimonials from '../../components/common/Testimonials'

function Home() {
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
            <PopularSearches compact />
            <RecentSearches compact />
          </motion.div>
        </div>
      </section>

      <CityMarquee />
      <StatsSection />
      <FeaturedListings />
      <HowItWorks />
      <NeighborhoodSpotlight />
      <Testimonials />
      <CTASection />
    </div>
  )
}

export default Home
