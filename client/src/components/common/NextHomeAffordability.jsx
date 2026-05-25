import { useMemo, useState } from 'react'
import { Home, PiggyBank, Scale } from 'lucide-react'

import { formatPrice } from '../../utils/formatPrice'
import Card from '../ui/Card'
import Input from '../ui/Input'
import SectionHeader from '../ui/SectionHeader'

const getEmi = ({ amount, rate, years }) => {
  const principal = Number(amount || 0)
  const monthlyRate = Number(rate || 0) / 12 / 100
  const months = Number(years || 0) * 12

  if (!principal || !monthlyRate || !months) return 0

  return Math.round((principal * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1))
}

function NextHomeAffordability() {
  const [income, setIncome] = useState('180000')
  const [monthlyDebt, setMonthlyDebt] = useState('25000')
  const [downPayment, setDownPayment] = useState('2000000')
  const [interestRate, setInterestRate] = useState('8.5')
  const [years, setYears] = useState('20')
  const [propertyPrice, setPropertyPrice] = useState('10000000')
  const [monthlyRent, setMonthlyRent] = useState('45000')

  const results = useMemo(() => {
    const availableEmi = Math.max(Number(income || 0) * 0.4 - Number(monthlyDebt || 0), 0)
    const monthlyRate = Number(interestRate || 0) / 12 / 100
    const months = Number(years || 0) * 12
    const loanCapacity = monthlyRate && months
      ? availableEmi * (((1 + monthlyRate) ** months - 1) / (monthlyRate * (1 + monthlyRate) ** months))
      : 0
    const affordableBudget = loanCapacity + Number(downPayment || 0)
    const emi = getEmi({
      amount: Math.max(Number(propertyPrice || 0) - Number(downPayment || 0), 0),
      rate: interestRate,
      years,
    })
    const yearlyRent = Number(monthlyRent || 0) * 12
    const buySignal = emi <= availableEmi && yearlyRent > Number(downPayment || 0) * 0.06

    return {
      availableEmi,
      affordableBudget,
      emi,
      downPaymentTarget: Number(propertyPrice || 0) * 0.2,
      rentVsBuy: buySignal ? 'Buying may be worth exploring' : 'Renting may stay more flexible',
    }
  }, [downPayment, income, interestRate, monthlyDebt, monthlyRent, propertyPrice, years])

  return (
    <Card>
      <SectionHeader
        eyebrow="Next home affordability"
        title="What can I afford?"
        description="Estimate buying power, EMI comfort, down payment target, and rent-vs-buy direction in one place."
      />

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Monthly household income" type="number" value={income} onChange={(event) => setIncome(event.target.value)} />
          <Input label="Existing monthly debt" type="number" value={monthlyDebt} onChange={(event) => setMonthlyDebt(event.target.value)} />
          <Input label="Available down payment" type="number" value={downPayment} onChange={(event) => setDownPayment(event.target.value)} />
          <Input label="Target property price" type="number" value={propertyPrice} onChange={(event) => setPropertyPrice(event.target.value)} />
          <Input label="Interest rate %" type="number" step="0.1" value={interestRate} onChange={(event) => setInterestRate(event.target.value)} />
          <Input label="Tenure years" type="number" value={years} onChange={(event) => setYears(event.target.value)} />
          <Input label="Current monthly rent" type="number" value={monthlyRent} onChange={(event) => setMonthlyRent(event.target.value)} className="sm:col-span-2" />
        </div>

        <div className="grid gap-3">
          {[
            [Home, 'Affordable budget', formatPrice(results.affordableBudget)],
            [PiggyBank, '20% down payment target', formatPrice(results.downPaymentTarget)],
            [Scale, 'Rent vs buy signal', results.rentVsBuy],
          ].map(([Icon, label, value]) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-surface p-5">
              <p className="flex items-center gap-2 text-sm font-bold text-slate-600">
                <Icon size={16} className="text-accent" />
                {label}
              </p>
              <p className="mt-2 text-2xl font-extrabold text-primary">{value}</p>
            </div>
          ))}
          <div className="rounded-3xl bg-primary p-5 text-white">
            <p className="text-sm font-bold text-white/70">Estimated EMI on target home</p>
            <p className="mt-2 text-3xl font-extrabold">{formatPrice(results.emi)}</p>
            <p className="mt-2 text-xs leading-5 text-white/65">Comfort EMI used: {formatPrice(results.availableEmi)} per month.</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default NextHomeAffordability
