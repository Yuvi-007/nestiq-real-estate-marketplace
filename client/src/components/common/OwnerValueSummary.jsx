import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit3, Home, TrendingUp } from 'lucide-react'

import { formatPrice } from '../../utils/formatPrice'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Input from '../ui/Input'
import SectionHeader from '../ui/SectionHeader'

const cityRates = {
  Mumbai: 22000,
  Pune: 9500,
  Delhi: 16000,
  Bangalore: 12000,
  Hyderabad: 10500,
  Chennai: 9800,
  Kolkata: 7500,
  Nashik: 5200,
  Gurgaon: 14500,
  Goa: 12500,
}

const confidenceByCity = {
  Mumbai: 'High',
  Pune: 'High',
  Bangalore: 'Medium',
  Hyderabad: 'Medium',
  Gurgaon: 'Medium',
}

function OwnerValueSummary() {
  const [city, setCity] = useState('Pune')
  const [type, setType] = useState('Apartment')
  const [area, setArea] = useState('1200')
  const [bhk, setBhk] = useState('3')
  const [condition, setCondition] = useState('Good')

  const estimate = useMemo(() => {
    const baseRate = cityRates[city] || 7000
    const typeMultiplier = type === 'Villa' ? 1.35 : type === 'House' ? 1.15 : type === 'Plot' ? 0.85 : 1
    const conditionMultiplier = condition === 'Renovated' ? 1.08 : condition === 'Needs repairs' ? 0.92 : 1
    const bhkMultiplier = Number(bhk) >= 4 ? 1.07 : 1
    const midpoint = Number(area || 0) * baseRate * typeMultiplier * conditionMultiplier * bhkMultiplier

    return {
      midpoint,
      low: midpoint * 0.9,
      high: midpoint * 1.1,
      confidence: confidenceByCity[city] || 'Limited',
    }
  }, [area, bhk, city, condition, type])

  return (
    <Card className="overflow-hidden shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <SectionHeader
            eyebrow="Market value"
            title="Home value estimate summary"
            description="A transparent demo estimate based on city, property type, area, BHK, and condition."
          />

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Input as="select" label="City" value={city} onChange={(event) => setCity(event.target.value)}>
              {Object.keys(cityRates).map((item) => <option key={item}>{item}</option>)}
            </Input>
            <Input as="select" label="Property type" value={type} onChange={(event) => setType(event.target.value)}>
              {['Apartment', 'Villa', 'House', 'Plot', 'PG'].map((item) => <option key={item}>{item}</option>)}
            </Input>
            <Input label="Area sqft" type="number" value={area} onChange={(event) => setArea(event.target.value)} />
            <Input label="BHK" type="number" value={bhk} onChange={(event) => setBhk(event.target.value)} />
            <Input as="select" label="Condition" value={condition} onChange={(event) => setCondition(event.target.value)} className="sm:col-span-2">
              {['Renovated', 'Good', 'Needs repairs'].map((item) => <option key={item}>{item}</option>)}
            </Input>
          </div>
        </div>

        <div className="rounded-3xl bg-primary p-5 text-white">
          <p className="flex items-center gap-2 text-sm font-bold text-white/70">
            <TrendingUp size={16} />
            Estimated price range
          </p>
          <p className="mt-3 text-3xl font-extrabold leading-tight">{formatPrice(estimate.low)} - {formatPrice(estimate.high)}</p>
          <div className="mt-5 rounded-2xl bg-white/10 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-white/55">Estimate midpoint</p>
            <p className="mt-1 text-2xl font-extrabold">{formatPrice(estimate.midpoint)}</p>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-extrabold">
            <Home size={16} />
            {estimate.confidence} confidence
          </div>
          <p className="mt-4 text-xs leading-5 text-white/65">
            Demo estimate only. This is not an appraisal, bank valuation, legal opinion, or guaranteed selling price.
          </p>
          <Button as={Link} to="/dashboard/seller" variant="accent" className="mt-5 w-full" icon={Edit3}>
            Edit home details
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default OwnerValueSummary
