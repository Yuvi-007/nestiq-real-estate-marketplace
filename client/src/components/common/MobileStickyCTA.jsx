import { CalendarDays, MessageCircle } from 'lucide-react'

import { formatPrice } from '../../utils/formatPrice'

function MobileStickyCTA({ price, onContact, onSchedule }) {
  return (
    <div className="fixed inset-x-0 bottom-16 z-40 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-12px_40px_rgba(15,23,42,0.12)] md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold uppercase text-slate-500">Price</p>
          <p className="truncate text-lg font-extrabold text-primary">{formatPrice(price)}</p>
        </div>
        <button
          type="button"
          onClick={onContact}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-primary"
          aria-label="Contact agent"
        >
          <MessageCircle size={19} />
        </button>
        <button
          type="button"
          onClick={onSchedule}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white"
          aria-label="Schedule visit"
        >
          <CalendarDays size={19} />
        </button>
      </div>
    </div>
  )
}

export default MobileStickyCTA
