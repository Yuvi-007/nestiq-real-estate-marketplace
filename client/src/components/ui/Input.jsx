import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { as: Component = 'input', className = '', label, id, icon: Icon, error, ...props },
  ref,
) {
  const control = (
    <div className="relative">
      {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />}
      <Component
        ref={ref}
        id={id}
        className={`w-full rounded-xl border bg-surface px-4 py-3 text-sm font-semibold text-primary outline-none transition placeholder:text-muted focus:border-accent focus:bg-white ${
          Icon ? 'pl-10' : ''
        } ${error ? 'border-danger' : 'border-slate-200'} ${className}`}
        {...props}
      />
    </div>
  )

  if (!label) {
    return control
  }

  return (
    <label className="block" htmlFor={id}>
      <span className="text-sm font-bold text-primary">{label}</span>
      <span className="mt-2 block">{control}</span>
      {error && <span className="mt-2 block text-sm font-semibold text-danger">{error}</span>}
    </label>
  )
})

export default Input
