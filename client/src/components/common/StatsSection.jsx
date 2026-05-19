import { motion } from 'framer-motion'

const stats = [
  ['10,000+', 'Premium Properties'],
  ['500+', 'Verified Agents'],
  ['50,000+', 'Happy Customers'],
  ['15+', 'Cities Covered'],
]

function StatsSection() {
  return (
    <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([value, label], index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-3xl font-extrabold text-primary">{value}</p>
            <p className="mt-2 text-sm font-semibold text-slate-600">{label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default StatsSection
