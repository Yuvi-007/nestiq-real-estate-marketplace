import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import Button from '../ui/Button'
import Card from '../ui/Card'
import Input from '../ui/Input'

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

function CalculatorCard({ type = 'emi', title, description }) {
  const [amount, setAmount] = useState(type === 'rent-vs-buy' ? '50000' : '7500000')
  const [rate, setRate] = useState('8.5')
  const [years, setYears] = useState('20')
  const [income, setIncome] = useState('150000')
  const [downPayment, setDownPayment] = useState('1500000')

  const result = useMemo(() => {
    const principal = Number(amount || 0)
    const monthlyRate = Number(rate || 0) / 12 / 100
    const months = Number(years || 0) * 12

    if (type === 'affordability') {
      return formatCurrency(Number(income || 0) * 55)
    }

    if (type === 'down-payment') {
      return formatCurrency(principal * 0.2)
    }

    if (type === 'rent-vs-buy') {
      return Number(amount || 0) * 12 > Number(downPayment || 0) * 0.08 ? 'Buying may be worth exploring' : 'Renting may stay flexible'
    }

    if (!principal || !monthlyRate || !months) return formatCurrency(0)
    const emi = (principal * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1)
    return formatCurrency(Math.round(emi))
  }, [amount, downPayment, income, rate, type, years])

  return (
    <Card>
      <h3 className="text-xl font-extrabold text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>

      <div className="mt-5 grid gap-3">
        {type === 'affordability' ? (
          <Input label="Monthly household income" type="number" value={income} onChange={(event) => setIncome(event.target.value)} />
        ) : (
          <Input label={type === 'rent-vs-buy' ? 'Monthly rent' : 'Loan / property amount'} type="number" value={amount} onChange={(event) => setAmount(event.target.value)} />
        )}
        {type === 'rent-vs-buy' ? (
          <Input label="Available down payment" type="number" value={downPayment} onChange={(event) => setDownPayment(event.target.value)} />
        ) : type !== 'affordability' && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Interest rate %" type="number" value={rate} onChange={(event) => setRate(event.target.value)} />
            <Input label="Tenure years" type="number" value={years} onChange={(event) => setYears(event.target.value)} />
          </div>
        )}
      </div>

      <div className="mt-5 rounded-2xl bg-surface p-4">
        <p className="text-xs font-extrabold uppercase text-slate-500">Estimate</p>
        <p className="mt-1 text-2xl font-extrabold text-primary">{result}</p>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">Calculations are estimates for planning only and are not financial advice.</p>
      <Button as={Link} to="/mortgage" variant="secondary" size="sm" className="mt-4">
        Learn more
      </Button>
    </Card>
  )
}

export default CalculatorCard
