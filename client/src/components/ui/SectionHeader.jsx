function SectionHeader({ eyebrow, title, description, action, className = '' }) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div>
        {eyebrow && <p className="text-sm font-bold uppercase tracking-wide text-accent">{eyebrow}</p>}
        <h2 className="mt-2 text-2xl font-extrabold text-primary">{title}</h2>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export default SectionHeader
