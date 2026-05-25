import { FileWarning, ShieldCheck, ShieldQuestion, XCircle } from 'lucide-react'

import Badge from '../ui/Badge'

const statusConfig = {
  notSubmitted: {
    label: 'Documents Not Submitted',
    icon: FileWarning,
    className: 'bg-slate-100 text-slate-700',
  },
  submitted: {
    label: 'Verification Pending',
    icon: ShieldQuestion,
    className: 'bg-accent/15 text-amber-700',
  },
  underReview: {
    label: 'Verification Pending',
    icon: ShieldQuestion,
    className: 'bg-accent/15 text-amber-700',
  },
  verified: {
    label: 'NestIQ Verified',
    icon: ShieldCheck,
    className: 'bg-success/10 text-success',
  },
  rejected: {
    label: 'Verification Rejected',
    icon: XCircle,
    className: 'bg-danger/10 text-danger',
  },
}

function VerificationStatusBadge({ status }) {
  const config = statusConfig[status || 'notSubmitted'] || statusConfig.notSubmitted
  const Icon = config.icon

  return (
    <Badge className={config.className}>
      <Icon size={14} />
      {config.label}
    </Badge>
  )
}

export default VerificationStatusBadge
