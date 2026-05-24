import { useState } from 'react'

import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Contact agent"
      title={property?.title}
      subtitle={`Agent: ${property?.agent?.name || 'NestIQ agent'}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          as="textarea"
          label="Message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={6}
          placeholder="I am interested in this property. Please contact me with more details."
          className="resize-none"
        />

        {feedback.text && (
          <div
            className={`rounded-xl px-4 py-3 text-sm font-semibold ${
              feedback.type === 'success'
                ? 'border border-success/20 bg-success/10 text-success'
                : 'border border-danger/20 bg-danger/10 text-danger'
            }`}
          >
            {feedback.text}
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send inquiry'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default ContactAgentModal
