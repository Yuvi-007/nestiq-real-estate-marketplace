import Input from '../ui/Input'

function PropertyFormStepDetails({ register, errors }) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Input id="bhk" type="number" label="BHK" {...register('bhk', { required: 'BHK is required', min: 0 })} error={errors.bhk?.message} />
        <Input id="bathrooms" type="number" label="Bathrooms" {...register('bathrooms', { required: 'Bathrooms are required', min: 0 })} error={errors.bathrooms?.message} />
        <Input id="area" type="number" label="Area sqft" {...register('area', { required: 'Area is required', min: { value: 1, message: 'Area must be greater than 0' } })} error={errors.area?.message} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Input id="floor" type="number" label="Floor" {...register('floor')} />
        <Input id="furnishing" label="Furnishing" {...register('furnishing')} placeholder="Semi-furnished" />
        <Input id="facing" label="Facing" {...register('facing')} placeholder="East" />
      </div>

      <div>
        <Input id="amenitiesText" label="Amenities" {...register('amenitiesText')} placeholder="Swimming Pool, Gym, Security" />
        <p className="mt-2 text-xs font-semibold text-slate-500">Separate amenities with commas.</p>
      </div>
    </div>
  )
}

export default PropertyFormStepDetails
