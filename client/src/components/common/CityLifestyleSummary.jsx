import { MapPinned, ShieldCheck, Sparkles } from 'lucide-react'

import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'

function CityLifestyleSummary({ city }) {
  const items = [
    [Sparkles, 'Lifestyle fit', `${city.name} scores ${city.lifestyleScore}/100 in this demo lifestyle model.`],
    [MapPinned, 'Top localities', city.topLocalities.slice(0, 3).join(', ')],
    [ShieldCheck, 'Market note', 'Market insights are demo estimates for project presentation.'],
  ]

  return (
    <Card>
      <SectionHeader eyebrow="Lifestyle" title={`Living in ${city.name}`} description={city.summary} />
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {items.map(([Icon, title, text]) => (
          <div key={title} className="rounded-2xl bg-surface p-5">
            <Icon className="text-accent" size={22} />
            <p className="mt-4 font-extrabold text-primary">{title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default CityLifestyleSummary
