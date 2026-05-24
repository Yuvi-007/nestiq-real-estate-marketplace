import { useState } from 'react'

import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'

function ScheduleVisitModal({ property, isOpen, onClose, onSubmit, isSubmitting }) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [feedback, setFeedback] = useState({ type: '', text: '' })

  if (!isOpen) {
    return null
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFeedback({ type: '', text: '' })

    try {
      await onSubmit({ date, time })
      setDate('')
      setTime('')
      setFeedback({ type: 'success', text: 'Visit scheduled successfully.' })
    } catch (error) {
      setFeedback({ type: 'error', text: error?.message || 'Unable to schedule visit.' })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Schedule visit"
      title={property?.title}
      subtitle={`Agent: ${property?.agent?.name || 'NestIQ agent'}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
          <Input
            label="Time"
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
          />
        </div>

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
            {isSubmitting ? 'Scheduling...' : 'Schedule visit'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default ScheduleVisitModal
