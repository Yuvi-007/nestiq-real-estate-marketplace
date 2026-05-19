function FieldError({ message }) {
  return message ? <p className="mt-2 text-sm font-semibold text-danger">{message}</p> : null
}

function PropertyFormStepDetails({ register, errors }) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-bold text-primary" htmlFor="bhk">BHK</label>
          <input id="bhk" type="number" {...register('bhk', { required: 'BHK is required', min: 0 })} className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-accent focus:ring-4 focus:ring-accent/15" />
          <FieldError message={errors.bhk?.message} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-primary" htmlFor="bathrooms">Bathrooms</label>
          <input id="bathrooms" type="number" {...register('bathrooms', { required: 'Bathrooms are required', min: 0 })} className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-accent focus:ring-4 focus:ring-accent/15" />
          <FieldError message={errors.bathrooms?.message} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-primary" htmlFor="area">Area sqft</label>
          <input id="area" type="number" {...register('area', { required: 'Area is required', min: { value: 1, message: 'Area must be greater than 0' } })} className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-accent focus:ring-4 focus:ring-accent/15" />
          <FieldError message={errors.area?.message} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-bold text-primary" htmlFor="floor">Floor</label>
          <input id="floor" type="number" {...register('floor')} className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-accent focus:ring-4 focus:ring-accent/15" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-primary" htmlFor="furnishing">Furnishing</label>
          <input id="furnishing" {...register('furnishing')} className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-accent focus:ring-4 focus:ring-accent/15" placeholder="Semi-furnished" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-primary" htmlFor="facing">Facing</label>
          <input id="facing" {...register('facing')} className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-accent focus:ring-4 focus:ring-accent/15" placeholder="East" />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-primary" htmlFor="amenitiesText">Amenities</label>
        <input id="amenitiesText" {...register('amenitiesText')} className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-accent focus:ring-4 focus:ring-accent/15" placeholder="Swimming Pool, Gym, Security" />
        <p className="mt-2 text-xs font-semibold text-slate-500">Separate amenities with commas.</p>
      </div>
    </div>
  )
}

export default PropertyFormStepDetails
