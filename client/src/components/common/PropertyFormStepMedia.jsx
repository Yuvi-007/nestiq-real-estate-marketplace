function PropertyFormStepMedia({ register }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-primary" htmlFor="imagesText">Image URLs</label>
      <textarea
        id="imagesText"
        {...register('imagesText')}
        rows={7}
        className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-accent focus:ring-4 focus:ring-accent/15"
        placeholder="Paste one image URL per line"
      />
      <p className="mt-2 text-xs font-semibold text-slate-500">
        Cloudinary will be added later. For now, use direct image URLs, one per line.
      </p>
    </div>
  )
}

export default PropertyFormStepMedia
