import { Eye, MessageCircle, ShieldCheck, UserRoundCheck, CalendarClock, BadgeCheck } from 'lucide-react'

import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'

const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : 'Recently')

function PropertyActivityTimeline({ property }) {
  const trustScore = property.trustScore
  const timelineItems = [
    {
      label: 'Listed recently',
      detail: `Listing created ${formatDate(property.createdAt)} and last updated ${formatDate(property.updatedAt)}.`,
      icon: CalendarClock,
    },
    {
      label: 'Views count',
      detail: `${property.views || 0} buyer views recorded on NestIQ.`,
      icon: Eye,
    },
    {
      label: 'NestIQ Trust Score generated',
      detail: trustScore ? `Score ${trustScore.overallScore}/10 with ${trustScore.riskLevel} risk profile.` : 'Score will appear when enough listing data is available.',
      icon: ShieldCheck,
    },
    {
      label: 'Agent assigned',
      detail: property.agent?.name ? `${property.agent.name} is attached to this listing.` : 'Agent details are not available yet.',
      icon: UserRoundCheck,
    },
    {
      label: 'Verification/risk status',
      detail: property.status ? `Current listing status is ${property.status}.` : 'Listing status is being reviewed.',
      icon: BadgeCheck,
    },
    {
      label: 'Buyer actions available',
      detail: 'Buyers can contact the agent or schedule a visit from this page.',
      icon: MessageCircle,
    },
  ]

  return (
    <Card>
      <SectionHeader
        eyebrow="Listing activity"
        title="Property activity timeline"
        description="A transparent timeline built from current listing data and available buyer actions."
      />

      <div className="mt-5 space-y-4">
        {timelineItems.map(({ label, detail, icon: Icon }, index) => (
          <div key={label} className="relative flex gap-4">
            {index < timelineItems.length - 1 && <span className="absolute left-5 top-10 h-[calc(100%+0.5rem)] w-px bg-slate-200" />}
            <span className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
              <Icon size={17} />
            </span>
            <div>
              <p className="text-sm font-extrabold text-primary">{label}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default PropertyActivityTimeline
