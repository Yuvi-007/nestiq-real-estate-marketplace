import { Home, Paintbrush, PiggyBank, TrendingUp, Warehouse } from 'lucide-react'

const tabs = [
  {
    label: 'Prepare to Sell',
    icon: Home,
    description: 'Organize listing facts, photos, documents, and agent conversations before going live.',
  },
  {
    label: 'Market Value',
    icon: TrendingUp,
    description: 'Use rule-based estimate ranges as a planning input, then validate with local comparables.',
  },
  {
    label: 'Renovations',
    icon: Paintbrush,
    description: 'Prioritize visible fixes, safety issues, and small upgrades that reduce buyer objections.',
  },
  {
    label: 'Ways to Save',
    icon: PiggyBank,
    description: 'Plan repair budgets, loan payoff, taxes, agent fees, and moving costs before accepting offers.',
  },
  {
    label: 'Host or Rent',
    icon: Warehouse,
    description: 'Compare selling with holding, renting, or hosting when the home has strong lifestyle demand.',
  },
]

function OwnerToolTabs({ active = 'Prepare to Sell', onChange }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/5">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = active === tab.label

          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => onChange?.(tab.label)}
              className={`flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-extrabold transition ${
                isActive
                  ? 'border-primary bg-primary text-white'
                  : 'border-slate-200 bg-surface text-charcoal hover:border-accent hover:bg-accent/10 hover:text-primary'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="mt-4 rounded-2xl bg-surface p-5">
        <p className="text-xs font-extrabold uppercase tracking-wide text-accent">Owner tools</p>
        <h2 className="mt-1 text-xl font-extrabold text-primary">{active}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          {tabs.find((tab) => tab.label === active)?.description || tabs[0].description}
        </p>
      </div>
    </section>
  )
}

export default OwnerToolTabs
