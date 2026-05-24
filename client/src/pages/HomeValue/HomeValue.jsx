import { Link } from 'react-router-dom'

import HomeValueEstimator from '../../components/common/HomeValueEstimator'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'

function HomeValue() {
  return (
    <section className="space-y-10">
      <PageHeader
        eyebrow="Home value"
        title="Estimate your property value before you sell"
        description="Use a transparent rule-based estimator to understand a broad planning range before creating a listing."
        action={<Button as={Link} to="/sell">View seller guide</Button>}
      />

      <HomeValueEstimator />

      <Card>
        <p className="text-sm font-extrabold uppercase tracking-wide text-accent">Important disclaimer</p>
        <h2 className="mt-2 text-2xl font-extrabold text-primary">This is not a real appraisal</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          NestIQ uses simple demo assumptions for city rates, area, property type, and amenities. Final pricing should be verified with local comparable sales, legal checks, and professional valuation advice.
        </p>
      </Card>
    </section>
  )
}

export default HomeValue
