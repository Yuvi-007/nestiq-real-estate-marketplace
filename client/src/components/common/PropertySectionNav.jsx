const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'photos', label: 'Photos' },
  { id: 'intelligence', label: 'Intelligence' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'nearby', label: 'Nearby' },
  { id: 'fees-policies', label: 'Fees & Policies' },
  { id: 'contact', label: 'Contact' },
]

function PropertySectionNav() {
  const scrollToSection = (id) => {
    const section = document.getElementById(id)

    if (!section) return

    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="sticky top-16 z-30 -mx-4 border-y border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto overscroll-x-contain pb-1">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollToSection(section.id)}
            className="shrink-0 rounded-full border border-slate-200 bg-surface px-4 py-2 text-xs font-extrabold text-charcoal transition hover:border-accent hover:bg-accent/10 hover:text-primary"
          >
            {section.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default PropertySectionNav
