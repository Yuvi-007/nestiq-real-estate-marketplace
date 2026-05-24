import { BellRing, ExternalLink, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { deleteSavedSearch, getSavedSearches } from '../../utils/savedSearches'
import Button from '../ui/Button'
import Card from '../ui/Card'
import EmptyState from '../ui/EmptyState'
import SectionHeader from '../ui/SectionHeader'

const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : '-')

function SavedSearchesPanel() {
  const navigate = useNavigate()
  const [savedSearches, setSavedSearches] = useState(() => getSavedSearches())

  useEffect(() => {
    const refreshSearches = () => setSavedSearches(getSavedSearches())

    window.addEventListener('nestiq-saved-searches-updated', refreshSearches)
    window.addEventListener('storage', refreshSearches)
    return () => {
      window.removeEventListener('nestiq-saved-searches-updated', refreshSearches)
      window.removeEventListener('storage', refreshSearches)
    }
  }, [])

  const handleDelete = (id) => {
    setSavedSearches(deleteSavedSearch(id))
  }

  return (
    <section className="space-y-5">
      <SectionHeader
        eyebrow="Search alerts"
        title="Saved searches"
        description="Saved search alerts are local demo alerts in this version. Email/push alerts can be added later."
      />

      {savedSearches.length === 0 ? (
        <EmptyState
          icon={BellRing}
          title="No saved searches yet"
          description="Save a search from the marketplace to reopen the same filters from your dashboard."
          actionLabel="Open marketplace"
          actionTo="/properties"
        />
      ) : (
        <div className="grid gap-3">
          {savedSearches.map((search) => (
            <Card key={search.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-base font-extrabold text-primary">{search.label}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">Saved {formatDate(search.createdAt)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  icon={ExternalLink}
                  onClick={() => navigate(`/properties?${search.queryParams}`)}
                >
                  Open search
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  icon={Trash2}
                  onClick={() => handleDelete(search.id)}
                  className="hover:border-danger hover:text-danger"
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}

export default SavedSearchesPanel
