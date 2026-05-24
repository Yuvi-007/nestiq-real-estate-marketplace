import { BellPlus, CheckCircle2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import useAuth from '../../hooks/useAuth'
import { buildSavedSearchLabel, isSearchSaved, saveSearch } from '../../utils/savedSearches'
import Button from '../ui/Button'

function SavedSearchButton({ filters, queryParams }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const [message, setMessage] = useState('')
  const [messageQuery, setMessageQuery] = useState('')
  const label = useMemo(() => buildSavedSearchLabel(filters), [filters])
  const currentQuery = queryParams.toString()
  const saved = isSearchSaved(queryParams)
  const activeMessage = messageQuery === currentQuery ? message : ''

  const handleSave = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } })
      return
    }

    saveSearch({ label, queryParams })
    setMessageQuery(currentQuery)
    setMessage('Search saved. Local demo alerts are now available in your dashboard.')
  }

  return (
    <div className="space-y-2">
      <Button
        variant={saved ? 'secondary' : 'accent'}
        icon={saved ? CheckCircle2 : BellPlus}
        onClick={handleSave}
        className="w-full sm:w-auto"
      >
        {saved ? 'Search saved' : 'Save search'}
      </Button>
      {activeMessage && <p className="text-xs font-semibold text-success">{activeMessage}</p>}
      <p className="text-xs leading-5 text-slate-500">
        Saved search alerts are local demo alerts in this version. Email/push alerts can be added later.
      </p>
    </div>
  )
}

export default SavedSearchButton
