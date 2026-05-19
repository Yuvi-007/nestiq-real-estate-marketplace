import { X } from 'lucide-react'
import { useState } from 'react'

function ContactAgentModal({ property, isOpen, onClose, onSubmit, isSubmitting }) {
  const [message, setMessage] = useState('')
  const [feedback, setFeedback] = useState({ type: '', text: '' })

  if (!isOpen) {
    return null
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFeedback({ type: '', text: '' })

    try {
      await onSubmit(message)
      setMessage('')
      setFeedback({ type: 'success', text: 'Inquiry sent successfully.' })
    } catch (error) {
      setFeedback({ type: 'error', text: error?.message || 'Unable to send inquiry.' })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/70 px-4 py-6">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-accent">Contact agent</p>
            <h2 className="mt-1 text-2xl font-extrabold text-primary">{property?.title}</h2>
            <p className="mt-1 text-sm text-slate-600">Agent: {property?.agent?.name || 'NestIQ agent'}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-danger hover:text-danger"
            aria-label="Close contact modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <label className="block">
            <span className="text-sm font-bold text-primary">Message</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={6}
              placeholder="I am interested in this property. Please contact me with more details."
              className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm text-primary outline-none transition focus:border-accent"
            />
          </label>

          {feedback.text && (
            <div
              className={`rounded-lg px-4 py-3 text-sm font-semibold ${
                feedback.type === 'success'
                  ? 'border border-success/20 bg-success/10 text-success'
                  : 'border border-danger/20 bg-danger/10 text-danger'
              }`}
            >
              {feedback.text}
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-bold text-primary transition hover:border-accent"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-charcoal disabled:cursor-wait disabled:opacity-70"
            >
              {isSubmitting ? 'Sending...' : 'Send inquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContactAgentModal
