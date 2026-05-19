import { Star } from 'lucide-react'

const testimonials = [
  ['Ananya Rao', 'Mumbai buyer', 'NestIQ made shortlisting premium homes feel structured and trustworthy. The verified agent details saved me days.'],
  ['Vikram Malhotra', 'Pune investor', 'The marketplace view helped me compare price, locality, and amenities quickly before scheduling visits.'],
  ['Meera Nair', 'Goa homeowner', 'The experience feels premium without being confusing. I could understand each listing at a glance.'],
]

function Testimonials() {
  return (
    <section className="bg-surface px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase text-accent">Customer voices</p>
          <h2 className="mt-3 font-display text-4xl font-bold text-primary">Trusted by Serious Home Seekers</h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map(([name, role, quote], index) => (
            <article key={name} className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={starIndex} size={17} fill="currentColor" />
                ))}
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-600">"{quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-accent">
                  {index + 1}
                </span>
                <div>
                  <p className="font-bold text-primary">{name}</p>
                  <p className="text-sm text-muted">{role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
