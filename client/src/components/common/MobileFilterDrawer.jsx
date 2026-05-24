import { X } from 'lucide-react'
import FilterSidebar from './FilterSidebar'

function MobileFilterDrawer({ isOpen, filters, onChange, onApply, onClear, onClose }) {
  if (!isOpen) {
    return null
  }

  const applyAndClose = () => {
    onApply()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[70] lg:hidden">
      <button type="button" className="absolute inset-0 bg-primary/60" aria-label="Close filters" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-2xl bg-surface p-4 pb-24 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-lg font-extrabold text-primary">Filters</p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-primary"
            aria-label="Close filters"
          >
            <X size={19} />
          </button>
        </div>
        <FilterSidebar filters={filters} onChange={onChange} onApply={applyAndClose} onClear={onClear} />
      </div>
    </div>
  )
}

export default MobileFilterDrawer
