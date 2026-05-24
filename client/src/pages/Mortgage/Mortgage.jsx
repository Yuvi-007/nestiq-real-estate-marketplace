import CalculatorCard from '../../components/common/CalculatorCard'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import SectionHeader from '../../components/ui/SectionHeader'

function Mortgage() {
  return (
    <section className="space-y-10">
      <PageHeader
        eyebrow="Home Loan & EMI Center"
        title="Plan your purchase with simple calculators"
        description="Estimate EMI, affordability, down payment, and rent-vs-buy tradeoffs. These tools are for planning only."
      />

      <div className="grid gap-5 md:grid-cols-2">
        <CalculatorCard title="EMI calculator" description="Estimate monthly loan payments from amount, rate, and tenure." />
        <CalculatorCard type="affordability" title="Affordability calculator" description="Estimate a rough property budget from monthly income." />
        <CalculatorCard type="rent-vs-buy" title="Rent vs buy mini calculator" description="Compare current rent and available down payment at a high level." />
        <CalculatorCard type="down-payment" title="Down payment planner" description="Estimate a 20% down payment planning amount." />
      </div>

      <Card>
        <SectionHeader eyebrow="Education" title="Before applying for a home loan" />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {['Compare interest rates and processing fees.', 'Keep emergency funds separate from down payment.', 'Confirm stamp duty, registration, and maintenance costs.'].map((item) => (
            <div key={item} className="rounded-2xl bg-surface p-5 text-sm font-semibold leading-6 text-slate-700">{item}</div>
          ))}
        </div>
        <p className="mt-5 text-xs leading-5 text-slate-500">Disclaimer: These calculations are estimates and are not financial, legal, or lending advice.</p>
      </Card>
    </section>
  )
}

export default Mortgage
