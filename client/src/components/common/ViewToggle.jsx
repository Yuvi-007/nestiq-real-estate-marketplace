import { Grid3X3, List, Map } from 'lucide-react'

const viewModes = [
  { value: 'grid', label: 'Grid', icon: Grid3X3 },
  { value: 'list', label: 'List', icon: List },
  { value: 'map', label: 'Map', icon: Map },
]

function ViewToggle({ viewMode, onChange }) {
  return (
    <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm" aria-label="Change result view">
      {viewModes.map((mode) => {
        const Icon = mode.icon
        const isActive = viewMode === mode.value

        return (
          <button
            key={mode.value}
            type="button"
            onClick={() => onChange(mode.value)}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${
              isActive ? 'bg-primary text-white shadow-sm' : 'text-muted hover:bg-surface hover:text-primary'
            }`}
            aria-pressed={isActive}
          >
            <Icon size={16} />
            <span className="hidden sm:inline">{mode.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default ViewToggle
