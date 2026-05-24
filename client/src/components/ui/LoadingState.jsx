function LoadingState({ title = 'Loading', message = 'Preparing the latest data.', compact = false, className = '' }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white px-6 text-center shadow-sm ${compact ? 'py-8' : 'py-12'} ${className}`}>
      <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-accent" />
      <h2 className="mt-5 text-xl font-extrabold text-primary">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{message}</p>
    </div>
  )
}

export default LoadingState
