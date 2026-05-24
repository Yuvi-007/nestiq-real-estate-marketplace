function Input({ as: Component = 'input', className = '', label, id, ...props }) {
  const control = (
    <Component
      id={id}
      className={`w-full rounded-xl border border-slate-200 bg-surface px-4 py-3 text-sm font-semibold text-primary outline-none transition placeholder:text-muted focus:border-accent focus:bg-white ${className}`}
      {...props}
    />
  )

  if (!label) {
    return control
  }

  return (
    <label className="block" htmlFor={id}>
      <span className="text-sm font-bold text-primary">{label}</span>
      <span className="mt-2 block">{control}</span>
    </label>
  )
}

export default Input
