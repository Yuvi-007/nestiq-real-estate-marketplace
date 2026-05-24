import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

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

function HomeValueEstimator() {
  const [city, setCity] = useState('Pune')
  const [type, setType] = useState('Apartment')
  const [area, setArea] = useState('1200')
  const [bhk, setBhk] = useState('3')
  const [amenities, setAmenities] = useState('Parking, Security')

  const estimate = useMemo(() => {
    const baseRate = cityRates[city] || 7000
    const typeMultiplier = type === 'Villa' ? 1.35 : type === 'House' ? 1.15 : type === 'Plot' ? 0.85 : 1
    const amenityBoost = amenities.trim() ? 1.08 : 1
    const bhkBoost = Number(bhk) >= 4 ? 1.08 : 1
    const midpoint = Number(area || 0) * baseRate * typeMultiplier * amenityBoost * bhkBoost

    return {
      low: midpoint * 0.9,
      high: midpoint * 1.1,
    }
  }, [amenities, area, bhk, city, type])

  const formatValue = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value)

  return (
    <Card>
      <SectionHeader
        eyebrow="Home value"
        title="Rule-based home value estimator"
        description="Estimate range based on city, type, area, BHK, and amenities. This is not a real appraisal."
      />

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Input as="select" label="City" value={city} onChange={(event) => setCity(event.target.value)}>
          {Object.keys(cityRates).map((item) => <option key={item}>{item}</option>)}
        </Input>
        <Input as="select" label="Property type" value={type} onChange={(event) => setType(event.target.value)}>
          {['Apartment', 'Villa', 'House', 'Plot', 'PG'].map((item) => <option key={item}>{item}</option>)}
        </Input>
        <Input label="Area sqft" type="number" value={area} onChange={(event) => setArea(event.target.value)} />
        <Input label="BHK" type="number" value={bhk} onChange={(event) => setBhk(event.target.value)} />
        <Input className="md:col-span-2" label="Amenities" value={amenities} onChange={(event) => setAmenities(event.target.value)} />
      </div>

      <div className="mt-6 rounded-2xl bg-primary p-5 text-white">
        <p className="text-sm font-bold uppercase tracking-wide text-accent">Estimated range</p>
        <p className="mt-2 text-3xl font-extrabold">{formatValue(estimate.low)} - {formatValue(estimate.high)}</p>
        <p className="mt-3 text-sm leading-6 text-white/70">
          This range is a planning estimate using transparent demo assumptions. It is not a legal valuation, bank appraisal, or market guarantee.
        </p>
      </div>

      <Button as={Link} to="/sell" className="mt-5">Plan a sale</Button>
    </Card>
  )
}

export default HomeValueEstimator
