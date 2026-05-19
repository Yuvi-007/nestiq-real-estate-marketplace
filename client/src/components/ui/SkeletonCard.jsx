function SkeletonCard({ variant = 'grid' }) {
  const isList = variant === 'list'

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${
        isList ? 'grid md:grid-cols-[320px_minmax(0,1fr)]' : ''
      }`}
    >
      <div className={`${isList ? 'aspect-[16/10] md:aspect-auto md:min-h-72' : 'aspect-[4/3]'} animate-pulse bg-slate-200`} />
      <div className="space-y-4 p-5">
        <div className="h-6 w-28 animate-pulse rounded-full bg-slate-200" />
        <div className="h-7 w-4/5 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
        <div className="flex flex-wrap gap-2 rounded-xl bg-surface p-3">
          <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-8 w-24 animate-pulse rounded-lg bg-slate-200" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200" />
      </div>
    </div>
  )
}

export default SkeletonCard
