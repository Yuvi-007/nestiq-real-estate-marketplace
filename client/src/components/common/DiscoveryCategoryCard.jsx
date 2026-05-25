import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function DiscoveryCategoryCard({ icon: Icon, title, description, to, meta }) {
  return (
    <Link
      to={to}
      className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 transition hover:-translate-y-0.5 hover:border-accent hover:shadow-[0_20px_60px_rgba(15,23,42,0.10)]"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-amber-700">
          <Icon size={22} />
        </span>
        <ArrowRight size={18} className="text-muted transition group-hover:translate-x-1 group-hover:text-accent" />
      </div>
      <h3 className="mt-5 text-lg font-extrabold text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      {meta && <p className="mt-4 text-xs font-extrabold uppercase tracking-wide text-muted">{meta}</p>}
    </Link>
  )
}

export default DiscoveryCategoryCard
