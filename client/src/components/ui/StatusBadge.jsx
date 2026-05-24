const styles = {
  active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  approved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  rejected: 'border-red-200 bg-red-50 text-red-700',
  sold: 'border-slate-200 bg-slate-100 text-slate-700',
  LOW: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  MEDIUM: 'border-amber-200 bg-amber-50 text-amber-700',
  HIGH: 'border-red-200 bg-red-50 text-red-700',
}

function StatusBadge({ status = 'active', className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-extrabold uppercase ${styles[status] || styles.sold} ${className}`}>
      {status}
    </span>
  )
}

export default StatusBadge
