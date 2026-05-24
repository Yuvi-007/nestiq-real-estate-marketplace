import { Link } from 'react-router-dom'
import { ClipboardCheck, Home, ImagePlus, ListChecks } from 'lucide-react'

import ServiceHero from '../../components/common/ServiceHero'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import SectionHeader from '../../components/ui/SectionHeader'

const checklist = ['Upload at least 3 clear images', 'Write a 100+ character description', 'Add exact location and map coordinates', 'Add amenities, furnishing, and facing', 'Review listing quality before publishing']

function Sell() {
  return (
    <section className="space-y-10">
      <ServiceHero
        eyebrow="Sell with NestIQ"
        title="List your property with quality signals buyers understand"
        description="Create polished listings, upload real images, and use the listing quality checklist before publishing."
        mode="sell"
        showSearch={false}
        primaryAction={<Button as={Link} to="/dashboard/seller" variant="accent">List your property</Button>}
        secondaryAction={<Button as={Link} to="/home-value" variant="secondary" className="bg-white">Estimate your value</Button>}
      />

      <Card>
        <SectionHeader eyebrow="Seller preparation" title="Get your listing ready" />
        <div className="mt-5 grid gap-3">
          {checklist.map((item) => (
            <div key={item} className="flex gap-3 rounded-2xl bg-surface p-4 text-sm font-semibold text-slate-700">
              <ClipboardCheck className="shrink-0 text-accent" size={18} />
              {item}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeader eyebrow="How selling works" title="Publish in a guided flow" />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            [Home, 'Add property details', 'Enter title, pricing, location, dimensions, and amenities.'],
            [ImagePlus, 'Upload images', 'Use Cloudinary-backed uploads for real listing media.'],
            [ListChecks, 'Review quality', 'Check completion score and improvement tips before publishing.'],
          ].map(([Icon, title, text]) => (
            <div key={title} className="rounded-2xl bg-surface p-5">
              <Icon className="text-accent" size={24} />
              <h3 className="mt-4 text-lg font-extrabold text-primary">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeader eyebrow="Seller FAQs" title="Common seller questions" />
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            ['Can I publish with a low quality score?', 'Yes. NestIQ warns you, but does not block publishing. Better quality may increase buyer trust.'],
            ['Are uploads paid?', 'No paid API is added here. Existing Cloudinary upload flow handles property images.'],
            ['Can admins moderate listings?', 'Yes. Admins can review, approve, reject, and manage listing statuses.'],
            ['Is value estimate an appraisal?', 'No. Home value estimates are rule-based planning estimates, not legal appraisals.'],
          ].map(([question, answer]) => (
            <div key={question} className="rounded-2xl border border-slate-200 p-5">
              <p className="font-extrabold text-primary">{question}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{answer}</p>
            </div>
          ))}
        </div>
      </Card>
    </section>
  )
}

export default Sell
