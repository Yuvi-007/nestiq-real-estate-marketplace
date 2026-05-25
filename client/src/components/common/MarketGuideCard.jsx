import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function MarketGuideCard({ icon: Icon, title, description, to = '/properties?mode=buy' }) {
  return (
    <Link
      to={to}
      className="rounded-3xl border border-slate-200 bg-surface p-5 transition hover:border-accent hover:bg-accent/10"
    >
      <Icon className="text-accent" size={24} />
      <h3 className="mt-4 text-lg font-extrabold text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <p className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-primary">
        Explore
        <ArrowRight size={15} />
      </p>
    </Link>
  )
}

export default MarketGuideCard
