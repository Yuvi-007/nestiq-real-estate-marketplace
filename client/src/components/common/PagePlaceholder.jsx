function PagePlaceholder({ eyebrow, title, description }) {
  return (
    <section className="border-b border-slate-200 py-14 sm:py-20">
      <div className="max-w-4xl">
        <p className="text-sm font-bold uppercase text-accent">{eyebrow}</p>
        <h1 className="mt-4 font-display text-4xl font-bold text-primary sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">{description}</p>
      </div>
    </section>
  )
}

export default PagePlaceholder
