import { useMemo, useState } from 'react'
import { CheckCircle2, ClipboardCheck } from 'lucide-react'

import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'

const checklistItems = [
  'Confirm ownership and basic property documents',
  'Fix visible repair issues before photos',
  'Collect maintenance, tax, and society dues details',
  'Take clear daylight photos of every major room',
  'Write a complete description with area, floor, furnishing, and amenities',
  'Compare nearby listings before setting an asking price',
]

function SellerPrepChecklist() {
  const [checkedItems, setCheckedItems] = useState(['Confirm ownership and basic property documents'])
  const progress = useMemo(() => Math.round((checkedItems.length / checklistItems.length) * 100), [checkedItems.length])

  const toggleItem = (item) => {
    setCheckedItems((currentItems) => (
      currentItems.includes(item)
        ? currentItems.filter((currentItem) => currentItem !== item)
        : [...currentItems, item]
    ))
  }

  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <SectionHeader
          eyebrow="Prepare to sell"
          title="Seller preparation checklist"
          description="Track the basics that make a listing easier for buyers to trust and compare."
        />
        <div className="w-full rounded-2xl bg-surface p-4 sm:w-44">
          <p className="text-xs font-extrabold uppercase tracking-wide text-muted">Ready score</p>
          <p className="mt-1 text-3xl font-extrabold text-primary">{progress}%</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {checklistItems.map((item) => {
          const checked = checkedItems.includes(item)

          return (
            <label
              key={item}
              className={`flex cursor-pointer gap-3 rounded-2xl border p-4 text-sm font-semibold transition ${
                checked ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-700 hover:border-accent'
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleItem(item)}
                className="sr-only"
              />
              {checked ? <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={18} /> : <ClipboardCheck className="mt-0.5 shrink-0 text-accent" size={18} />}
              <span>{item}</span>
            </label>
          )
        })}
      </div>
    </Card>
  )
}

export default SellerPrepChecklist
