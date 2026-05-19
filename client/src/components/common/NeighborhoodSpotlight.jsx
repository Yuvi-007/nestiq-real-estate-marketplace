import { Link } from 'react-router-dom'

const neighborhoods = [
  ['Mumbai', 'Sea-facing apartments, luxury towers, and central business access.', 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=900&q=80'],
  ['Pune', 'IT corridors, gated communities, and high-growth family neighborhoods.', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=900&q=80'],
  ['Bangalore', 'Premium villas, tech park access, and mature urban communities.', 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=900&q=80'],
  ['Goa', 'Beachside villas, rental yield potential, and lifestyle-led investments.', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80'],
]

function NeighborhoodSpotlight() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase text-accent">Neighborhood spotlight</p>
          <h2 className="mt-3 font-display text-4xl font-bold text-primary">Explore High-Intent Markets</h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {neighborhoods.map(([city, text, image]) => (
            <Link
              key={city}
              to={`/properties?city=${city}`}
              className="group relative min-h-80 overflow-hidden rounded-lg bg-primary shadow-sm"
            >
              <img src={image} alt={city} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/45 to-transparent" />
              <div className="absolute bottom-0 p-6">
                <p className="text-2xl font-extrabold text-white">{city}</p>
                <p className="mt-3 text-sm leading-6 text-slate-200">{text}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default NeighborhoodSpotlight
