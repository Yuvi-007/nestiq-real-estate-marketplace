import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'

function CityPropertyTypeBreakdown({ city }) {
  return (
    <Card>
      <SectionHeader
        eyebrow="Inventory mix"
        title={`Popular property types in ${city.name}`}
        description="Demo split based on platform-style market presentation data."
      />
      <div className="mt-5 space-y-4">
        {city.popularPropertyTypes.map(([type, value]) => (
          <div key={type}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-extrabold text-primary">{type}</span>
              <span className="font-bold text-slate-500">{value}%</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-accent" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default CityPropertyTypeBreakdown
