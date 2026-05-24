import { useMemo, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, Send } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'

import PropertyFormStepBasic from './PropertyFormStepBasic'
import PropertyFormStepDetails from './PropertyFormStepDetails'
import PropertyFormStepMedia from './PropertyFormStepMedia'
import PropertyFormStepPreview from './PropertyFormStepPreview'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Input from '../ui/Input'
import SectionHeader from '../ui/SectionHeader'

const defaultValues = {
  title: '',
  description: '',
  type: '',
  price: '',
  location: {
    address: '',
    city: '',
    lat: '',
    lng: '',
  },
  bhk: '',
  bathrooms: '',
  area: '',
  floor: '',
  furnishing: '',
  facing: '',
  amenitiesText: '',
  imagesText: '',
  uploadedImages: [],
}

const steps = ['Basic Info', 'Location', 'Details', 'Media', 'Preview']

const numberOrUndefined = (value) => {
  if (value === '' || value === undefined || value === null) return undefined
  return Number(value)
}

const listFromText = (value, separator = ',') =>
  (value || '')
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean)

function LocationStep({ register, errors }) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="address"
          label="Address"
          {...register('location.address', { required: 'Address is required' })}
          placeholder="Sector 62, Golf Course Extension"
          error={errors.location?.address?.message}
        />
        <Input
          id="city"
          label="City"
          {...register('location.city', { required: 'City is required' })}
          placeholder="Gurugram"
          error={errors.location?.city?.message}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="lat"
          type="number"
          step="any"
          label="Latitude"
          {...register('location.lat', { required: 'Latitude is required' })}
          placeholder="28.4595"
          error={errors.location?.lat?.message}
        />
        <Input
          id="lng"
          type="number"
          step="any"
          label="Longitude"
          {...register('location.lng', { required: 'Longitude is required' })}
          placeholder="77.0266"
          error={errors.location?.lng?.message}
        />
      </div>
    </div>
  )
}

function AddPropertyWizard({ onCreate, isSubmitting }) {
  const [step, setStep] = useState(0)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const {
    register,
    handleSubmit,
    trigger,
    reset,
    control,
    formState: { errors },
  } = useForm({ defaultValues })

  const values = useWatch({ control })
  const stepFields = useMemo(
    () => [
      ['title', 'description', 'type', 'price'],
      ['location.address', 'location.city', 'location.lat', 'location.lng'],
      ['bhk', 'bathrooms', 'area'],
      [],
      [],
    ],
    [],
  )

  const nextStep = async () => {
    const fields = stepFields[step]
    const isValid = fields.length === 0 ? true : await trigger(fields)
    if (isValid) setStep((current) => Math.min(current + 1, steps.length - 1))
  }

  const previousStep = () => {
    setStep((current) => Math.max(current - 1, 0))
  }

  const buildPayload = (formValues) => ({
    title: formValues.title.trim(),
    description: formValues.description.trim(),
    type: formValues.type,
    price: Number(formValues.price),
    location: {
      address: formValues.location.address.trim(),
      city: formValues.location.city.trim(),
      lat: Number(formValues.location.lat),
      lng: Number(formValues.location.lng),
    },
    bhk: Number(formValues.bhk),
    bathrooms: Number(formValues.bathrooms),
    area: Number(formValues.area),
    floor: numberOrUndefined(formValues.floor),
    furnishing: formValues.furnishing.trim(),
    facing: formValues.facing.trim(),
    amenities: listFromText(formValues.amenitiesText),
    images: [
      ...(formValues.uploadedImages || []).map((image) => image.url),
      ...listFromText(formValues.imagesText, '\n'),
    ],
    status: 'active',
  })

  const onSubmit = async (formValues) => {
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const payload = buildPayload(formValues)

      if (payload.images.length === 0) {
        setErrorMessage('Please upload at least one image or add an image URL.')
        setStep(3)
        return
      }

      await onCreate(payload)
      reset(defaultValues)
      setStep(0)
      setSuccessMessage('Property published successfully.')
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || 'Unable to create property')
    }
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionHeader eyebrow="Add property" title="Publish a new listing" />
        <div className="flex flex-wrap gap-2">
          {steps.map((label, index) => (
            <span
              key={label}
              className={`rounded-xl px-3 py-2 text-xs font-extrabold ${
                index === step ? 'bg-primary text-white' : index < step ? 'bg-success/10 text-success' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {index < step && <Check className="mr-1 inline" size={13} />}
              {label}
            </span>
          ))}
        </div>
      </div>

      {successMessage && <div className="mt-5 rounded-2xl border border-success/20 bg-success/10 px-4 py-3 text-sm font-semibold text-success">{successMessage}</div>}
      {errorMessage && <div className="mt-5 rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{errorMessage}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        {step === 0 && <PropertyFormStepBasic register={register} errors={errors} />}
        {step === 1 && <LocationStep register={register} errors={errors} />}
        {step === 2 && <PropertyFormStepDetails register={register} errors={errors} />}
        {step === 3 && <PropertyFormStepMedia register={register} control={control} />}
        {step === 4 && <PropertyFormStepPreview values={values} />}

        <div className="flex flex-wrap justify-between gap-3 border-t border-slate-100 pt-5">
          <Button
            variant="secondary"
            onClick={previousStep}
            disabled={step === 0}
            icon={ChevronLeft}
          >
            Back
          </Button>

          {step < steps.length - 1 ? (
            <Button
              onClick={nextStep}
              icon={ChevronRight}
              iconPosition="right"
            >
              Continue
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              icon={Send}
              iconPosition="right"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Property'}
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}

export default AddPropertyWizard
