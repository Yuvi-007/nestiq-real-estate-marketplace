import { Check, Share2 } from 'lucide-react'
import { useState } from 'react'

import Button from '../ui/Button'

function SharePropertyButton({ property }) {
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title || 'NestIQ property',
          text: 'View this NestIQ property listing.',
          url,
        })
        return
      } catch {
        // Fall back to copying when native share is dismissed or unavailable.
      }
    }

    await navigator.clipboard.writeText(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <Button variant="secondary" onClick={copyLink} icon={copied ? Check : Share2} className={copied ? 'border-success text-success' : 'text-charcoal'}>
      {copied ? 'Link copied' : 'Share'}
    </Button>
  )
}

export default SharePropertyButton
