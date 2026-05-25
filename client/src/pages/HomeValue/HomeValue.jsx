import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit3, Home, ShieldCheck } from 'lucide-react'

import AgentProposalCards from '../../components/common/AgentProposalCards'
import OwnerToolTabs from '../../components/common/OwnerToolTabs'
import OwnerValueSummary from '../../components/common/OwnerValueSummary'
import SellerProceedsCalculator from '../../components/common/SellerProceedsCalculator'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import SectionHeader from '../../components/ui/SectionHeader'

function HomeValue() {
  const [activeTool, setActiveTool] = useState('Market Value')

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-wide text-accent">Home value</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight text-primary sm:text-5xl">
              Estimate your home value before you sell
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Update property facts, review a demo price range, and move into seller planning when you are ready.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <Button as={Link} to="/dashboard/seller" icon={Edit3}>
              Edit home details
            </Button>
            <Button as={Link} to="/sell" variant="secondary" icon={Home}>
              View seller guide
            </Button>
          </div>
        </div>
      </div>

      <OwnerToolTabs active={activeTool} onChange={setActiveTool} />
      <OwnerValueSummary />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <SellerProceedsCalculator compact />
        <Card>
          <ShieldCheck className="text-success" size={28} />
          <h2 className="mt-4 text-2xl font-extrabold text-primary">Estimate confidence</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Confidence depends on the city demo rate, property facts, area completeness, and condition assumptions. Treat the range as a planning signal only.
          </p>
          <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-xs font-semibold leading-5 text-amber-800">
            Demo estimate only. This is not an appraisal, legal valuation, bank valuation, or financial advice.
          </p>
        </Card>
      </div>

      <Card>
        <SectionHeader
          eyebrow="What affects value"
          title="Facts buyers and agents usually check"
          description="A clearer home profile can improve buyer confidence before visits."
        />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            ['Property facts', 'Area, BHK, bathrooms, furnishing, floor, facing, and ownership details.'],
            ['Condition', 'Recent repairs, paint, electrical, plumbing, society upkeep, and photo quality.'],
            ['Local demand', 'Nearby comparables, transit, schools, hospitals, and rental/resale demand.'],
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl bg-surface p-5">
              <h3 className="font-extrabold text-primary">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </Card>

      <AgentProposalCards />
    </section>
  )
}

export default HomeValue
