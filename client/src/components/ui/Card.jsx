function Card({ as: Component = 'section', className = '', children, padded = true, ...props }) {
  return (
    <Component
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${padded ? 'p-5' : ''} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Card
