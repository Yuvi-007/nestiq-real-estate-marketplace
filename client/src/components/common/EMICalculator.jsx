import { useMemo, useState } from 'react'

import { formatPrice } from '../../utils/formatPrice'

function EMICalculator({ price }) {
  const [downPayment, setDownPayment] = useState(20)
  const [interestRate, setInterestRate] = useState(8.5)
  const [years, setYears] = useState(20)

  const emi = useMemo(() => {
    const principal = Number(price || 0) * (1 - downPayment / 100)
    const monthlyRate = interestRate / 12 / 100
    const months = years * 12

    if (!principal || !monthlyRate || !months) {
      return 0
    }

    return Math.round((principal * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1))
  }, [downPayment, interestRate, price, years])

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-primary">EMI Calculator</h2>
      <p className="mt-1 text-sm text-slate-600">Approximate monthly payment</p>

      <div className="mt-5 rounded-lg bg-primary p-4 text-white">
        <p className="text-xs font-bold uppercase text-slate-300">Estimated EMI</p>
        <p className="mt-1 text-2xl font-extrabold">{formatPrice(emi)}</p>
      </div>

      <div className="mt-5 space-y-5">
        <label className="block">
          <span className="flex justify-between text-sm font-semibold text-charcoal">
            Down payment <span>{downPayment}%</span>
          </span>
          <input
            type="range"
            min="5"
            max="50"
            value={downPayment}
            onChange={(event) => setDownPayment(Number(event.target.value))}
            className="mt-3 w-full accent-amber-500"
          />
        </label>

        <label className="block">
          <span className="flex justify-between text-sm font-semibold text-charcoal">
            Interest rate <span>{interestRate}%</span>
          </span>
          <input
            type="range"
            min="6"
            max="12"
            step="0.1"
            value={interestRate}
            onChange={(event) => setInterestRate(Number(event.target.value))}
            className="mt-3 w-full accent-amber-500"
          />
        </label>

        <label className="block">
          <span className="flex justify-between text-sm font-semibold text-charcoal">
            Tenure <span>{years} years</span>
          </span>
          <input
            type="range"
            min="5"
            max="30"
            value={years}
            onChange={(event) => setYears(Number(event.target.value))}
            className="mt-3 w-full accent-amber-500"
          />
        </label>
      </div>
    </section>
  )
}

export default EMICalculator
