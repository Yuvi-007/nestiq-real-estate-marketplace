import { useMemo, useState } from 'react'
import { Calculator, IndianRupee } from 'lucide-react'

import { formatPrice } from '../../utils/formatPrice'
import Card from '../ui/Card'
import Input from '../ui/Input'
import SectionHeader from '../ui/SectionHeader'

const toNumber = (value) => Number(value || 0)

function SellerProceedsCalculator({ compact = false }) {
  const [estimatedSalePrice, setEstimatedSalePrice] = useState('15000000')
  const [loanBalance, setLoanBalance] = useState('3500000')
  const [repairCosts, setRepairCosts] = useState('250000')
  const [commission, setCommission] = useState('2')
  const [transferTax, setTransferTax] = useState('1')
  const [miscCosts, setMiscCosts] = useState('150000')

  const estimate = useMemo(() => {
    const salePrice = toNumber(estimatedSalePrice)
    const commissionCost = salePrice * (toNumber(commission) / 100)
    const transferTaxCost = salePrice * (toNumber(transferTax) / 100)
    const totalCosts = toNumber(loanBalance) + toNumber(repairCosts) + commissionCost + transferTaxCost + toNumber(miscCosts)

    return {
      commissionCost,
      transferTaxCost,
      totalCosts,
      proceeds: salePrice - totalCosts,
    }
  }, [commission, estimatedSalePrice, loanBalance, miscCosts, repairCosts, transferTax])

  return (
    <Card className="shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <SectionHeader
        eyebrow="Seller proceeds"
        title={compact ? 'Proceeds preview' : 'Estimate your seller proceeds'}
        description="Frontend-only planning math. Final proceeds depend on actual offers, loan payoff, taxes, fees, and closing terms."
      />

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Estimated sale price" type="number" value={estimatedSalePrice} onChange={(event) => setEstimatedSalePrice(event.target.value)} />
          <Input label="Loan balance" type="number" value={loanBalance} onChange={(event) => setLoanBalance(event.target.value)} />
          <Input label="Repair costs" type="number" value={repairCosts} onChange={(event) => setRepairCosts(event.target.value)} />
          <Input label="Misc. closing / moving costs" type="number" value={miscCosts} onChange={(event) => setMiscCosts(event.target.value)} />
          <Input label="Agent commission %" type="number" step="0.1" value={commission} onChange={(event) => setCommission(event.target.value)} />
          <Input label="Transfer tax / duties %" type="number" step="0.1" value={transferTax} onChange={(event) => setTransferTax(event.target.value)} />
        </div>

        <div className="rounded-3xl bg-primary p-5 text-white">
          <p className="flex items-center gap-2 text-sm font-bold text-white/70">
            <IndianRupee size={16} />
            Estimated proceeds
          </p>
          <p className="mt-3 text-3xl font-extrabold">{formatPrice(Math.max(estimate.proceeds, 0))}</p>

          <div className="mt-5 grid gap-3 text-sm">
            {[
              ['Commission', estimate.commissionCost],
              ['Transfer tax / duties', estimate.transferTaxCost],
              ['Total estimated costs', estimate.totalCosts],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 border-t border-white/10 pt-3">
                <span className="text-white/70">{label}</span>
                <span className="font-extrabold">{formatPrice(value)}</span>
              </div>
            ))}
          </div>

          <p className="mt-5 flex gap-2 text-xs leading-5 text-white/65">
            <Calculator size={14} className="mt-0.5 shrink-0" />
            Estimate = sale price minus loan balance, repairs, commission, transfer costs, and miscellaneous seller costs.
          </p>
        </div>
      </div>
    </Card>
  )
}

export default SellerProceedsCalculator
