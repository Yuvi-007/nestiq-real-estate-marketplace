import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Sparkles, X } from 'lucide-react'

import {
  getRecommendedProperties,
  saveRecommendationPreferences,
} from '../../utils/recommendationEngine'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Input from '../ui/Input'
import RecommendationResults from './RecommendationResults'

const initialPreferences = {
  city: 'Mumbai',
  budget: '1cr-2cr',
  intent: 'Buy',
  familySize: 'family',
  propertyType: 'Apartment',
  bhk: '2',
  parking: false,
  gym: false,
  pool: false,
  furnished: false,
  verified: true,
  useCase: 'self-use',
}

const steps = [
  {
    title: 'Location and budget',
    fields: ['city', 'budget', 'intent'],
  },
  {
    title: 'Home fit',
    fields: ['familySize', 'propertyType', 'bhk'],
  },
  {
    title: 'Must-have preferences',
    fields: ['parking', 'gym', 'pool', 'furnished', 'verified', 'useCase'],
  },
]

const selectOptions = {
  city: ['Mumbai', 'Pune', 'Goa', 'Bangalore', 'Delhi', 'Hyderabad', 'Nashik', 'Gurgaon'],
  budget: [
    ['under-50l', 'Under Rs 50L'],
    ['50l-1cr', 'Rs 50L - Rs 1Cr'],
    ['1cr-2cr', 'Rs 1Cr - Rs 2Cr'],
    ['2cr-plus', 'Rs 2Cr+'],
    ['rent-under-50k', 'Rent under Rs 50K/mo'],
    ['rent-50k-plus', 'Rent Rs 50K+/mo'],
  ],
  intent: ['Buy', 'Rent', 'PG'],
  familySize: [
    ['single', 'Single'],
    ['couple', 'Couple'],
    ['family', 'Family'],
    ['large-family', 'Large family'],
  ],
  propertyType: ['Apartment', 'Villa', 'Independent House', 'Studio', 'Plot'],
  bhk: ['1', '2', '3', '4'],
  useCase: [
    ['self-use', 'Self-use'],
    ['investment', 'Investment'],
  ],
}

function SelectField({ label, value, onChange, options }) {
  return (
    <Input
      as="select"
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="bg-white"
    >
      {options.map((option) => {
        const optionValue = Array.isArray(option) ? option[0] : option
        const optionLabel = Array.isArray(option) ? option[1] : option

        return (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        )
      })}
    </Input>
  )
}

function ToggleField({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`rounded-2xl border px-4 py-3 text-left text-sm font-extrabold transition ${
        checked
          ? 'border-accent bg-accent/15 text-primary shadow-sm'
          : 'border-slate-200 bg-white text-slate-600 hover:border-accent'
      }`}
    >
      {label}
    </button>
  )
}

function RecommendationQuiz({ properties = [], isOpen, onClose, onComplete }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [preferences, setPreferences] = useState(initialPreferences)
  const [recommendations, setRecommendations] = useState([])
  const [hasCompleted, setHasCompleted] = useState(false)
  const progress = useMemo(() => Math.round(((stepIndex + 1) / steps.length) * 100), [stepIndex])

  if (!isOpen) return null

  const updatePreference = (key, value) => {
    setPreferences((current) => ({ ...current, [key]: value }))
  }

  const completeQuiz = () => {
    const nextRecommendations = getRecommendedProperties(properties, preferences, 6)
    setRecommendations(nextRecommendations)
    setHasCompleted(true)
    saveRecommendationPreferences(preferences, nextRecommendations)
    onComplete?.(nextRecommendations, preferences)
  }

  const resetQuiz = () => {
    setStepIndex(0)
    setHasCompleted(false)
    setRecommendations([])
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-primary/70 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-surface shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-accent">Find My Best Property</p>
            <h2 className="text-xl font-extrabold text-primary">Recommendation Quiz</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-danger hover:text-danger"
            aria-label="Close recommendation quiz"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {!hasCompleted ? (
            <Card className="mx-auto max-w-3xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold text-primary">Step {stepIndex + 1} of {steps.length}</p>
                  <h3 className="mt-1 text-2xl font-extrabold text-charcoal">{steps[stepIndex].title}</h3>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary">
                  <Sparkles size={14} />
                  {progress}% complete
                </span>
              </div>

              <div className="mt-5 h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {stepIndex === 0 && (
                  <>
                    <SelectField label="Preferred city" value={preferences.city} onChange={(value) => updatePreference('city', value)} options={selectOptions.city} />
                    <SelectField label="Budget range" value={preferences.budget} onChange={(value) => updatePreference('budget', value)} options={selectOptions.budget} />
                    <SelectField label="Buy / Rent / PG" value={preferences.intent} onChange={(value) => updatePreference('intent', value)} options={selectOptions.intent} />
                  </>
                )}
                {stepIndex === 1 && (
                  <>
                    <SelectField label="Family size" value={preferences.familySize} onChange={(value) => updatePreference('familySize', value)} options={selectOptions.familySize} />
                    <SelectField label="Preferred property type" value={preferences.propertyType} onChange={(value) => updatePreference('propertyType', value)} options={selectOptions.propertyType} />
                    <SelectField label="Required BHK" value={preferences.bhk} onChange={(value) => updatePreference('bhk', value)} options={selectOptions.bhk} />
                  </>
                )}
                {stepIndex === 2 && (
                  <>
                    <ToggleField label="Need parking?" checked={preferences.parking} onChange={(value) => updatePreference('parking', value)} />
                    <ToggleField label="Need gym?" checked={preferences.gym} onChange={(value) => updatePreference('gym', value)} />
                    <ToggleField label="Need pool?" checked={preferences.pool} onChange={(value) => updatePreference('pool', value)} />
                    <ToggleField label="Need furnished property?" checked={preferences.furnished} onChange={(value) => updatePreference('furnished', value)} />
                    <ToggleField label="Need verified property?" checked={preferences.verified} onChange={(value) => updatePreference('verified', value)} />
                    <SelectField label="Investment or self-use?" value={preferences.useCase} onChange={(value) => updatePreference('useCase', value)} options={selectOptions.useCase} />
                  </>
                )}
              </div>

              <p className="mt-6 rounded-2xl bg-surface p-4 text-sm font-semibold leading-6 text-slate-600">
                Recommendations are rule-based demo suggestions using your selected preferences and listing data.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <Button
                  variant="secondary"
                  icon={ArrowLeft}
                  disabled={stepIndex === 0}
                  onClick={() => setStepIndex((current) => Math.max(current - 1, 0))}
                >
                  Back
                </Button>
                {stepIndex < steps.length - 1 ? (
                  <Button icon={ArrowRight} iconPosition="right" onClick={() => setStepIndex((current) => current + 1)}>
                    Next
                  </Button>
                ) : (
                  <Button icon={Sparkles} onClick={completeQuiz}>
                    Show Recommendations
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-600">
                  Showing the strongest current matches for your saved quiz preferences.
                </p>
                <Button variant="secondary" onClick={resetQuiz}>Retake quiz</Button>
              </div>
              <RecommendationResults recommendations={recommendations} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecommendationQuiz
