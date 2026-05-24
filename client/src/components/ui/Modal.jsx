import { X } from 'lucide-react'

function Modal({ isOpen, onClose, eyebrow, title, subtitle, children, footer, maxWidth = 'max-w-lg' }) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/70 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6">
      <section className={`max-h-[90vh] w-full ${maxWidth} overflow-hidden rounded-2xl bg-white shadow-2xl`} role="dialog" aria-modal="true">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
          <div>
            {eyebrow && <p className="text-sm font-bold uppercase tracking-wide text-accent">{eyebrow}</p>}
            {title && <h2 className="mt-1 text-2xl font-extrabold text-primary">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-danger hover:text-danger"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[calc(90vh-9rem)] overflow-y-auto p-4 sm:p-5">{children}</div>
        {footer && <div className="border-t border-slate-100 bg-surface px-5 py-4">{footer}</div>}
      </section>
    </div>
  )
}

export default Modal
