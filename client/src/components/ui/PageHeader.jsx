function PageHeader({ eyebrow, title, description, action, className = '' }) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div>
        {eyebrow && <p className="text-sm font-bold uppercase tracking-wide text-accent">{eyebrow}</p>}
        <h1 className="mt-2 font-display text-4xl font-bold leading-tight text-primary sm:text-5xl">{title}</h1>
        {description && <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export default PageHeader
