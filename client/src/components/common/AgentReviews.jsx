import { Star } from 'lucide-react'

import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'

function AgentReviews({ agent }) {
  return (
    <Card>
      <SectionHeader
        eyebrow="Reviews"
        title="Client feedback"
        description="Review content is demo placeholder feedback for presentation."
      />
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {agent.reviewHighlights.map((review) => (
          <div key={review} className="rounded-2xl bg-surface p-5">
            <p className="flex items-center gap-1 text-sm font-bold text-accent">
              {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={14} fill="currentColor" />)}
            </p>
            <p className="mt-4 text-sm font-semibold leading-6 text-slate-700">{review}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default AgentReviews
