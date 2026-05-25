import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, HelpCircle, Home, KeyRound, TrendingUp } from 'lucide-react'

import AgentProposalCards from '../../components/common/AgentProposalCards'
import OwnerToolTabs from '../../components/common/OwnerToolTabs'
import SellerPrepChecklist from '../../components/common/SellerPrepChecklist'
import SellerProceedsCalculator from '../../components/common/SellerProceedsCalculator'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import SectionHeader from '../../components/ui/SectionHeader'

const faqs = [
  ['How should I price my property?', 'Start with the demo home value range, compare nearby active listings, then validate with a local agent or professional valuation.'],
  ['Can I list from the seller dashboard?', 'Yes. Use the seller dashboard to add a property, upload photos, and review listing quality before publishing.'],
  ['Are proceeds guaranteed?', 'No. Proceeds are estimates only and depend on actual offers, loan payoff, taxes, fees, repairs, and closing terms.'],
  ['Should I renovate before selling?', 'Prioritize repairs that improve trust: leaks, electrical issues, paint, cleaning, lighting, and clear photos.'],
]

function Sell() {
  const [activeTool, setActiveTool] = useState('Prepare to Sell')

  return (
    <section className="space-y-8">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-sm font-extrabold uppercase tracking-wide text-accent">Sell with NestIQ</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight text-primary sm:text-5xl">
              A cleaner way to prepare, price, and list your home
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Use owner tools to estimate value, prepare your listing, preview seller proceeds, and compare local agents before publishing.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to="/home-value" variant="accent" size="lg" icon={TrendingUp}>
                What is your property worth?
              </Button>
              <Button as={Link} to="/dashboard/seller" variant="secondary" size="lg" icon={Home}>
                Go to seller dashboard
              </Button>
            </div>
          </div>
          <div className="bg-primary p-6 text-white sm:p-8 lg:p-10">
            <p className="text-sm font-bold text-white/60">Owner path</p>
            <div className="mt-5 grid gap-4">
              {[
                ['1', 'Estimate market value'],
                ['2', 'Prepare listing details'],
                ['3', 'Compare agent support'],
                ['4', 'Publish from dashboard'],
              ].map(([step, label]) => (
                <div key={step} className="flex items-center gap-4 rounded-2xl bg-white/10 p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-sm font-extrabold text-primary">{step}</span>
                  <p className="font-extrabold">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <OwnerToolTabs active={activeTool} onChange={setActiveTool} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <SellerPrepChecklist />
        <Card className="bg-accent/10">
          <KeyRound className="text-accent" size={28} />
          <h2 className="mt-4 text-2xl font-extrabold text-primary">Ready to list?</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add property details, images, amenities, and verification data from the seller dashboard.
          </p>
          <Button as={Link} to="/dashboard/seller" className="mt-5 w-full" icon={ArrowRight} iconPosition="right">
            Add property
          </Button>
        </Card>
      </div>

      <SellerProceedsCalculator compact />
      <AgentProposalCards />

      <Card>
        <SectionHeader eyebrow="Seller FAQ" title="Common owner questions" />
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {faqs.map(([question, answer]) => (
            <div key={question} className="rounded-2xl border border-slate-200 p-5">
              <p className="flex items-center gap-2 font-extrabold text-primary">
                <HelpCircle size={17} className="text-accent" />
                {question}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{answer}</p>
            </div>
          ))}
        </div>
      </Card>
    </section>
  )
}

export default Sell
