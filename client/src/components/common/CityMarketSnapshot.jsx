import { BarChart3, Home, IndianRupee, Sparkles, TrendingUp } from 'lucide-react'

import Card from '../ui/Card'

function CityMarketSnapshot({ city }) {
  const cards = [
    [IndianRupee, 'Average price', city.averagePrice],
    [Home, 'Avg. price / sqft', city.averagePricePerSqft],
    [TrendingUp, 'Demand level', city.demandLevel],
    [BarChart3, 'Investment score', `${city.investmentScore}/100`],
    [Sparkles, 'Lifestyle score', `${city.lifestyleScore}/100`],
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map(([Icon, label, value]) => (
        <Card key={label}>
          <Icon className="text-accent" size={22} />
          <p className="mt-4 text-xs font-extrabold uppercase text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-extrabold text-primary">{value}</p>
        </Card>
      ))}
    </div>
  )
}

export default CityMarketSnapshot
