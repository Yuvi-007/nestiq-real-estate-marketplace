import { useState } from 'react'
import { AlertTriangle, Calculator, CreditCard, Landmark, Scale } from 'lucide-react'

import CalculatorCard from '../../components/common/CalculatorCard'
import NextHomeAffordability from '../../components/common/NextHomeAffordability'
import OwnerToolTabs from '../../components/common/OwnerToolTabs'
import Card from '../../components/ui/Card'
import SectionHeader from '../../components/ui/SectionHeader'

function Mortgage() {
  const [activeTool, setActiveTool] = useState('Ways to Save')

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-wide text-accent">Mortgage planning</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight text-primary sm:text-5xl">
              Plan EMI, affordability, and rent-vs-buy decisions
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Simple frontend-only calculators for buyers and owners planning the next move. Estimates are not lending advice.
            </p>
          </div>
          <div className="rounded-3xl bg-primary p-5 text-white">
            <p className="flex items-center gap-2 text-sm font-bold text-white/70">
              <Calculator size={16} />
              What can I afford?
            </p>
            <p className="mt-2 text-2xl font-extrabold">Use income, debt, down payment, and rent to estimate a planning budget.</p>
          </div>
        </div>
      </div>

      <OwnerToolTabs active={activeTool} onChange={setActiveTool} />

      <NextHomeAffordability />

      <div className="grid gap-5 md:grid-cols-2">
        <CalculatorCard title="EMI calculator" description="Estimate monthly loan payments from amount, rate, and tenure." />
        <CalculatorCard type="affordability" title="Affordability calculator" description="Estimate a rough property budget from monthly income." />
        <CalculatorCard type="down-payment" title="Down payment planner" description="Estimate a 20% down payment planning amount." />
        <CalculatorCard type="rent-vs-buy" title="Rent vs buy comparison" description="Compare current rent and available down payment at a high level." />
      </div>

      <Card>
        <SectionHeader eyebrow="Ways to save" title="Costs to check before applying" />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            [Landmark, 'Loan costs', 'Compare interest rates, processing fees, prepayment rules, and insurance requirements.'],
            [CreditCard, 'Monthly comfort', 'Keep emergency funds separate and avoid using every rupee of approved loan capacity.'],
            [Scale, 'Ownership costs', 'Confirm stamp duty, registration, maintenance, repairs, parking, and moving costs.'],
          ].map(([Icon, title, text]) => (
            <div key={title} className="rounded-2xl bg-surface p-5">
              <Icon className="text-accent" size={24} />
              <h3 className="mt-4 font-extrabold text-primary">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 flex gap-2 rounded-2xl bg-amber-50 p-4 text-xs font-semibold leading-5 text-amber-800">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
          Disclaimer: These calculations are planning estimates only and are not financial, legal, lending, or tax advice.
        </p>
      </Card>
    </section>
  )
}

export default Mortgage
