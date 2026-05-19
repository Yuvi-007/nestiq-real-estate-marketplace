import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function CTASection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-lg bg-gradient-to-r from-primary via-charcoal to-primary p-8 shadow-2xl sm:p-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase text-accent">For owners and sellers</p>
            <h2 className="mt-3 font-display text-4xl font-bold text-white">List your property for free</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Bring your listing to serious buyers with a premium presentation layer and agent-ready workflows.
            </p>
          </div>
          <Link
            to="/dashboard/seller"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-extrabold text-primary transition hover:bg-amber-400"
          >
            Start listing
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CTASection
