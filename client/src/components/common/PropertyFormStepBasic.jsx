function FieldError({ message }) {
  return message ? <p className="mt-2 text-sm font-semibold text-danger">{message}</p> : null
}

function PropertyFormStepBasic({ register, errors }) {
  return (
    <div className="grid gap-4">
      <div>
        <label className="mb-2 block text-sm font-bold text-primary" htmlFor="title">Title</label>
        <input
          id="title"
          {...register('title', { required: 'Title is required', minLength: { value: 5, message: 'Title must be at least 5 characters' } })}
          className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-accent focus:ring-4 focus:ring-accent/15"
          placeholder="Luxury 3 BHK apartment near metro"
        />
        <FieldError message={errors.title?.message} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-primary" htmlFor="description">Description</label>
        <textarea
          id="description"
          {...register('description', { required: 'Description is required', minLength: { value: 20, message: 'Description must be at least 20 characters' } })}
          rows={5}
          className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-accent focus:ring-4 focus:ring-accent/15"
          placeholder="Describe the property, neighborhood, amenities, and buyer highlights."
        />
        <FieldError message={errors.description?.message} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-bold text-primary" htmlFor="type">Type</label>
          <select
            id="type"
            {...register('type', { required: 'Property type is required' })}
            className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-accent focus:ring-4 focus:ring-accent/15"
          >
            <option value="">Select type</option>
            {['House', 'Apartment', 'Villa', 'Plot', 'PG'].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <FieldError message={errors.type?.message} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-primary" htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            {...register('price', { required: 'Price is required', min: { value: 1, message: 'Price must be greater than 0' } })}
            className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-accent focus:ring-4 focus:ring-accent/15"
            placeholder="12500000"
          />
          <FieldError message={errors.price?.message} />
        </div>
      </div>
    </div>
  )
}

export default PropertyFormStepBasic
