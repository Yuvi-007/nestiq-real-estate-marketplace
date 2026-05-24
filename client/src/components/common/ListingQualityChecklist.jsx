import { AlertTriangle, CheckCircle2, Circle, FileCheck2 } from 'lucide-react'

import Card from '../ui/Card'
import Badge from '../ui/Badge'
import { calculateListingQuality, getListingQualityLabel } from '../../utils/listingQuality'

function ListingQualityChecklist({ data, compact = false }) {
  const quality = calculateListingQuality(data)
  const qualityLabel = getListingQualityLabel(quality.completionScore)
  const visibleIncompleteItems = compact ? quality.incompleteItems.slice(0, 3) : quality.incompleteItems

  return (
    <Card className={compact ? 'p-4' : ''}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-accent">
            <FileCheck2 size={16} />
            Listing quality
          </p>
          <h3 className="mt-2 text-2xl font-extrabold text-primary">{quality.completionScore}% complete</h3>
        </div>
        <Badge variant={qualityLabel.variant}>{qualityLabel.label}</Badge>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${quality.completionScore}%` }} />
      </div>

      {quality.completionScore < 70 && (
        <div className="mt-4 flex gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold leading-6 text-amber-800">
          <AlertTriangle size={17} className="mt-1 shrink-0" />
          <span>Your listing quality is low. You can publish, but improving it may increase buyer trust.</span>
        </div>
      )}

      <div className={`mt-5 grid gap-4 ${compact ? '' : 'lg:grid-cols-2'}`}>
        <div>
          <p className="text-sm font-extrabold text-primary">Completed</p>
          <ul className="mt-3 space-y-2">
            {quality.completedItems.length === 0 ? (
              <li className="text-sm text-slate-500">No completed checks yet.</li>
            ) : (
              quality.completedItems.map((item) => (
                <li key={item.key} className="flex gap-2 text-sm leading-6 text-slate-700">
                  <CheckCircle2 size={16} className="mt-1 shrink-0 text-success" />
                  <span>{item.label}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        <div>
          <p className="text-sm font-extrabold text-primary">Improve next</p>
          <ul className="mt-3 space-y-2">
            {visibleIncompleteItems.length === 0 ? (
              <li className="text-sm text-slate-500">All quality checks are complete.</li>
            ) : (
              visibleIncompleteItems.map((item) => (
                <li key={item.key} className="flex gap-2 text-sm leading-6 text-slate-700">
                  <Circle size={16} className="mt-1 shrink-0 text-slate-400" />
                  <span>
                    <span className="font-bold text-charcoal">{item.label}:</span> {item.tip}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </Card>
  )
}

export default ListingQualityChecklist
