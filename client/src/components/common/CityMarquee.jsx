import { motion } from 'framer-motion'

const cities = ['Mumbai', 'Delhi', 'Pune', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Nashik', 'Gurgaon', 'Goa']

function CityMarquee() {
  return (
    <section className="overflow-hidden border-y border-slate-200 bg-white py-5">
      <motion.div
        className="flex w-max gap-4"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      >
        {[...cities, ...cities].map((city, index) => (
          <span
            key={`${city}-${index}`}
            className="rounded-full border border-slate-200 bg-surface px-6 py-2 text-sm font-bold text-primary"
          >
            {city}
          </span>
        ))}
      </motion.div>
    </section>
  )
}

export default CityMarquee
