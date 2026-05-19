import PropertyCard from './PropertyCard'

function SimilarProperties({ properties = [] }) {
  if (properties.length === 0) {
    return null
  }

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-bold uppercase text-accent">More options</p>
        <h2 className="mt-2 text-2xl font-bold text-primary">Similar Properties</h2>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
        {properties.map((property) => (
          <PropertyCard key={property._id} property={property} variant="grid" />
        ))}
      </div>
    </section>
  )
}

export default SimilarProperties
