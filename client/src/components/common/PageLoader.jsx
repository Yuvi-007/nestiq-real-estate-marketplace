import { LoaderCircle } from 'lucide-react'

function PageLoader({
  compact = false,
  className = '',
  title = 'Loading NestIQ',
  message = 'Preparing the next view.',
}) {
  const wrapperClassName = `flex items-center justify-center px-4 ${compact ? 'min-h-64 py-8' : 'min-h-[60vh] py-12'} ${className}`

  return (
    <div
      className={wrapperClassName}
      role="status"
      aria-live="polite"
      aria-label={title}
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/10">
            <LoaderCircle size={24} className="animate-spin" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">NestIQ</p>
            <h2 className="mt-1 text-lg font-extrabold text-primary">{title}</h2>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-accent via-amber-400 to-primary" />
          </div>
          <div className="h-2 w-5/6 animate-pulse rounded-full bg-slate-100" />
          <div className="h-2 w-2/3 animate-pulse rounded-full bg-slate-100" />
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-600">{message}</p>
      </div>
    </div>
  )
}

export default PageLoader
