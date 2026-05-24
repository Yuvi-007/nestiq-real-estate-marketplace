import Input from '../ui/Input'

function PropertyFormStepBasic({ register, errors }) {
  return (
    <div className="grid gap-4">
      <Input
        id="title"
        label="Title"
        {...register('title', { required: 'Title is required', minLength: { value: 5, message: 'Title must be at least 5 characters' } })}
        placeholder="Luxury 3 BHK apartment near metro"
        error={errors.title?.message}
      />

      <div>
        <Input
          as="textarea"
          id="description"
          label="Description"
          {...register('description', { required: 'Description is required', minLength: { value: 20, message: 'Description must be at least 20 characters' } })}
          rows={5}
          placeholder="Describe the property, neighborhood, amenities, and buyer highlights."
          error={errors.description?.message}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Input
            as="select"
            id="type"
            label="Type"
            {...register('type', { required: 'Property type is required' })}
            error={errors.type?.message}
          >
            <option value="">Select type</option>
            {['House', 'Apartment', 'Villa', 'Plot', 'PG'].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Input>
        </div>

        <Input
          id="price"
          type="number"
          label="Price"
          {...register('price', { required: 'Price is required', min: { value: 1, message: 'Price must be greater than 0' } })}
          placeholder="12500000"
          error={errors.price?.message}
        />
      </div>
    </div>
  )
}

export default PropertyFormStepBasic
