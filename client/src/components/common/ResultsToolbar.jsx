import Button from '../ui/Button'
import Card from '../ui/Card'
import SortDropdown from './SortDropdown'
import ViewToggle from './ViewToggle'

function getSummary(filters) {
  const parts = []

  if (filters.type) parts.push(filters.type)
  if (filters.city) parts.push(`in ${filters.city}`)
  if (filters.q) parts.push(`matching "${filters.q}"`)

  if (parts.length === 0) {
    return 'Showing all verified marketplace listings'
  }

  return `Results for ${parts.join(' ')}`
}

function ResultsToolbar({ count, filters, onSortChange, viewMode, onViewChange, onOpenFilters }) {
  return (
    <Card className="px-4 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-lg font-extrabold text-primary">Showing {count} properties</p>
          <p className="mt-1 text-sm text-slate-600">{getSummary(filters)}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" size="sm" onClick={onOpenFilters} className="lg:hidden">
            Filters
          </Button>
          <SortDropdown value={filters.sort} onChange={onSortChange} />
          <ViewToggle viewMode={viewMode} onChange={onViewChange} />
        </div>
      </div>
    </Card>
  )
}

export default ResultsToolbar
