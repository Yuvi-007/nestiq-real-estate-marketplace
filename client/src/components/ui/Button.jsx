const variantStyles = {
  primary: 'bg-primary text-white shadow-sm hover:bg-charcoal',
  accent: 'bg-accent text-primary shadow-sm hover:bg-amber-400',
  secondary: 'border border-slate-200 bg-white text-primary hover:border-accent',
  ghost: 'text-primary hover:bg-slate-100',
  danger: 'border border-danger/20 bg-danger/10 text-danger hover:bg-danger hover:text-white',
}

const sizeStyles = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-sm',
}

function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  children,
  type,
  ...props
}) {
  const buttonType = Component === 'button' ? type || 'button' : type

  return (
    <Component
      type={buttonType}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-extrabold transition disabled:cursor-not-allowed disabled:opacity-60 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={16} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={16} />}
    </Component>
  )
}

export default Button
