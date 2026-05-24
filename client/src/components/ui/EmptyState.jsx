import Button from './Button'
import Card from './Card'

function EmptyState({ icon: Icon, title, description, actionLabel, onAction, actionTo }) {
  const actionProps = actionTo ? { as: 'a', href: actionTo } : { onClick: onAction }

  return (
    <Card className="px-6 py-14 text-center">
      {Icon && (
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <Icon size={26} />
        </span>
      )}
      <h2 className="mt-6 text-2xl font-extrabold text-primary">{title}</h2>
      {description && <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">{description}</p>}
      {actionLabel && (
        <Button className="mt-6" {...actionProps}>
          {actionLabel}
        </Button>
      )}
    </Card>
  )
}

export default EmptyState
