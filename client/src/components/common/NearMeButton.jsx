import { LocateFixed } from 'lucide-react'
import { useState } from 'react'

import Button from '../ui/Button'

function NearMeButton() {
  const [message, setMessage] = useState('')
  const [isLocating, setIsLocating] = useState(false)

  const locate = () => {
    if (!navigator.geolocation) {
      setMessage('Near-me search is not available in this browser.')
      return
    }

    setIsLocating(true)
    setMessage('')

    navigator.geolocation.getCurrentPosition(
      () => {
        setIsLocating(false)
        setMessage('Near-me search ready — backend radius filtering can be connected later.')
      },
      () => {
        setIsLocating(false)
        setMessage('Location permission was not available. You can still search by city or locality.')
      },
      { enableHighAccuracy: false, maximumAge: 60000, timeout: 8000 },
    )
  }

  return (
    <div className="space-y-2">
      <Button variant="secondary" icon={LocateFixed} onClick={locate} disabled={isLocating}>
        {isLocating ? 'Locating...' : 'Near me'}
      </Button>
      {message && <p className="max-w-md text-xs font-semibold leading-5 text-slate-500">{message}</p>}
    </div>
  )
}

export default NearMeButton
