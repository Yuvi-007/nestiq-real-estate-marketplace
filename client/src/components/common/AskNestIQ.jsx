import { useMemo, useState } from 'react'
import { ArrowRight, BrainCircuit, CheckCircle2, HelpCircle, SendHorizontal, Sparkles } from 'lucide-react'

import Button from '../ui/Button'
import Card from '../ui/Card'
import { askPropertyAssistant, suggestedNestIQQuestions } from '../../utils/propertyAssistant'

const confidenceStyles = {
  High: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Medium: 'border-amber-200 bg-amber-50 text-amber-700',
  Limited: 'border-slate-200 bg-slate-100 text-slate-700',
}

function AskNestIQ({ property, lifestyleInsights }) {
  const [question, setQuestion] = useState('')
  const [selectedQuestion, setSelectedQuestion] = useState(suggestedNestIQQuestions[0])

  const activeQuestion = selectedQuestion || question
  const answer = useMemo(() => (
    askPropertyAssistant({
      property,
      question: activeQuestion,
      lifestyleInsights,
    })
  ), [activeQuestion, lifestyleInsights, property])

  const handleSuggestedQuestion = (suggestion) => {
    setSelectedQuestion(suggestion)
    setQuestion('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedQuestion = question.trim()
    if (!trimmedQuestion) return

    setSelectedQuestion(trimmedQuestion)
  }

  return (
    <Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-white via-white to-amber-50/45 shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-accent">
            <BrainCircuit size={17} />
            Property assistant
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-primary">Ask NestIQ about this property</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            This assistant uses rule-based listing data analysis for demo purposes. It is not legal, financial, or valuation advice.
          </p>
        </div>

        <span className={`w-fit rounded-full border px-3 py-1 text-xs font-extrabold ${confidenceStyles[answer.confidence] || confidenceStyles.Limited}`}>
          {answer.confidence} confidence
        </span>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="space-y-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-extrabold text-primary">
              <HelpCircle size={16} className="text-accent" />
              Suggested questions
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestedNestIQQuestions.map((suggestion) => {
                const isActive = activeQuestion === suggestion

                return (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestedQuestion(suggestion)}
                    className={`rounded-full border px-3 py-2 text-left text-xs font-bold transition ${
                      isActive
                        ? 'border-accent bg-accent text-primary'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-accent hover:text-primary'
                    }`}
                  >
                    {suggestion}
                  </button>
                )
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-3">
            <label htmlFor="ask-nestiq-question" className="text-xs font-extrabold uppercase tracking-wide text-muted">
              Ask a custom question
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                id="ask-nestiq-question"
                type="text"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Example: Is this a risky listing?"
                className="min-h-11 flex-1 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-charcoal outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
              <Button type="submit" variant="accent" className="shrink-0" icon={SendHorizontal}>
                Ask
              </Button>
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-white">
              <Sparkles size={18} />
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wide text-muted">Answering</p>
              <p className="mt-1 text-sm font-extrabold text-primary">{activeQuestion}</p>
            </div>
          </div>

          <p className="mt-4 text-base font-extrabold leading-6 text-primary">{answer.shortAnswer}</p>

          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            {answer.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2">
                <CheckCircle2 size={16} className="mt-1 shrink-0 text-emerald-600" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface p-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Suggested next action</p>
              <p className="mt-1 text-sm font-extrabold text-primary">{answer.nextAction}</p>
            </div>
            <ArrowRight size={18} className="text-accent" />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default AskNestIQ
