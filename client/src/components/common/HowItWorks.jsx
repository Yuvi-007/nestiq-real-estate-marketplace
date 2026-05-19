import { CalendarCheck, Search, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

const steps = [
  ['Search your location', 'Start with the city, locality, property type, and budget that matter to you.', Search],
  ['Compare verified listings', 'Review pricing, amenities, agent details, and photos in one premium interface.', ShieldCheck],
  ['Schedule visit or contact agent', 'Move from shortlist to site visit with clear next actions.', CalendarCheck],
]

function HowItWorks() {
  return (
    <section className="bg-surface px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase text-accent">Simple process</p>
          <h2 className="mt-3 font-display text-4xl font-bold text-primary">How NestIQ Works</h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map(([title, text, Icon], index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-accent">
                <Icon size={23} />
              </span>
              <p className="mt-6 text-xl font-bold text-primary">{title}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
