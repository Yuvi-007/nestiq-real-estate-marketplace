import { Sparkles } from 'lucide-react'

import EmptyState from '../ui/EmptyState'
import SectionHeader from '../ui/SectionHeader'
import RecommendationMatchCard from './RecommendationMatchCard'

function RecommendationResults({ recommendations = [], className = '', compact = false }) {
  if (!recommendations.length) {
    return (
      <EmptyState
        icon={Sparkles}
        title="No recommendations yet"
        description="Complete the quiz to generate rule-based property suggestions from current listing data."
      />
    )
  }

  return (
    <section className={`space-y-5 ${className}`}>
      <SectionHeader
        eyebrow="Rule-based suggestions"
        title="Recommended properties"
        description="Recommendations are rule-based demo suggestions using your selected preferences and listing data."
      />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-6">
        {recommendations.map((recommendation) => (
          <RecommendationMatchCard
            key={recommendation.property._id}
            recommendation={recommendation}
            compact={compact}
          />
        ))}
      </div>
    </section>
  )
}

export default RecommendationResults
