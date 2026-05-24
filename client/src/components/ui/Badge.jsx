const variantStyles = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/15 text-amber-700',
  success: 'bg-success/10 text-success',
  danger: 'bg-danger/10 text-danger',
  neutral: 'bg-slate-100 text-slate-700',
}

function Badge({ variant = 'neutral', className = '', children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}

export default Badge
