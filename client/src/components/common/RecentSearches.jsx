import { Clock, ExternalLink, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { clearRecentSearches, getRecentSearches } from '../../utils/recentSearches'
import Button from '../ui/Button'
import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'

function RecentSearches({ compact = false }) {
  const navigate = useNavigate()
  const [recentSearches, setRecentSearches] = useState(() => getRecentSearches())

  useEffect(() => {
    const refresh = () => setRecentSearches(getRecentSearches())

    window.addEventListener('nestiq-recent-searches-updated', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('nestiq-recent-searches-updated', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  if (recentSearches.length === 0) {
    return null
  }

  return (
    <Card className={compact ? 'bg-white/95 shadow-xl backdrop-blur' : ''}>
      <SectionHeader
        eyebrow="Recent searches"
        title={compact ? 'Pick up where you left off' : 'Recent search paths'}
        action={
          <button type="button" onClick={() => setRecentSearches(clearRecentSearches())} className="text-sm font-extrabold text-slate-500 hover:text-danger">
            Clear
          </button>
        }
        className="[&_h2]:text-xl"
      />
      <div className="mt-5 flex flex-wrap gap-2">
        {recentSearches.map((search) => (
          <Button
            key={search.id}
            variant="secondary"
            size="sm"
            icon={compact ? Clock : ExternalLink}
            onClick={() => navigate(`/properties?${search.queryParams}`)}
          >
            <span className="max-w-[220px] truncate">{search.label}</span>
          </Button>
        ))}
        {!compact && (
          <Button variant="ghost" size="sm" icon={Trash2} onClick={() => setRecentSearches(clearRecentSearches())}>
            Clear recent
          </Button>
        )}
      </div>
    </Card>
  )
}

export default RecentSearches
