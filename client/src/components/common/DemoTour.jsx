import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, BadgeInfo, CheckCircle2, ExternalLink, Sparkles, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const storageKey = 'nestiq-demo-tour-dismissed'

const demoSteps = [
  {
    title: 'Browse Properties',
    eyebrow: 'Step 1',
    description:
      'Start from the homepage search or open the marketplace to browse buy and rent listings with filters, map view, quick view, and rich property cards.',
    bullets: ['Homepage search routes judges into real inventory.', 'The properties page supports filters, sorting, quick view, map view, and compare selection.'],
    actionLabel: 'Open Properties',
    actionPath: '/properties',
  },
  {
    title: 'Trust Score',
    eyebrow: 'Step 2',
    description:
      'Every listing can show a transparent NestIQ Score with risk level, strengths, warnings, and quality signals across price, media, location, and agent trust.',
    bullets: ['Compact badges appear on property cards.', 'Property detail pages show the full NestIQ Intelligence panel.'],
    actionLabel: 'Open Properties',
    actionPath: '/properties',
  },
  {
    title: 'Compare Properties',
    eyebrow: 'Step 3',
    description:
      'Select two or three listings to unlock smart compare insights that highlight the best overall score, value, location confidence, lowest risk, and media quality.',
    bullets: ['Compare stays lightweight and does not interrupt browsing.', 'Insights are derived from the trustScore data already returned by the API.'],
    actionLabel: 'Open Properties',
    actionPath: '/properties',
  },
  {
    title: 'Buyer Flow',
    eyebrow: 'Step 4',
    description:
      'Judges can sign in as a buyer to save properties, contact agents, schedule visits, and review buyer activity from the dashboard.',
    bullets: ['Saved properties and visit requests demonstrate real marketplace behavior.', 'Contact and schedule actions keep the buying journey practical.'],
    actionLabel: 'Open Login',
    actionPath: '/login',
  },
  {
    title: 'Seller Flow',
    eyebrow: 'Step 5',
    description:
      'The seller dashboard supports listing management, an add-property flow, and Cloudinary-backed image uploads for a polished supply-side demo.',
    bullets: ['Sellers can create listings with photos and structured details.', 'The upload flow proves the app handles real media, not placeholder-only data.'],
    actionLabel: 'Open Seller Dashboard',
    actionPath: '/dashboard/seller',
  },
  {
    title: 'Admin Flow',
    eyebrow: 'Step 6',
    description:
      'Admins can review platform stats, manage users, moderate listings, and use the risk overview to quickly spot suspicious or low-quality inventory.',
    bullets: ['Risk overview gives judges a clear operations story.', 'Moderation tools show the marketplace is managed, not just browsed.'],
    actionLabel: 'Open Admin Panel',
    actionPath: '/admin',
  },
  {
    title: 'Demo Accounts',
    eyebrow: 'Step 7',
    description:
      'Use these accounts during judging to quickly demonstrate the right dashboard without creating new users.',
    accounts: [
      ['Admin', 'admin@nestiq.com', 'Demo@1234'],
      ['Buyer', 'buyer@nestiq.com', 'Demo@1234'],
      ['Seller', 'rohan.seller@nestiq.com', 'Demo@1234'],
      ['Agent', 'priya.agent@nestiq.com', 'Demo@1234'],
    ],
    actionLabel: 'Open Login',
    actionPath: '/login',
  },
]

function DemoTour() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeStep = demoSteps[activeIndex]
  const progress = useMemo(() => ((activeIndex + 1) / demoSteps.length) * 100, [activeIndex])

  const openTour = () => {
    setIsOpen(true)
  }

  const closeTour = useCallback(() => {
    localStorage.setItem(storageKey, 'true')
    setIsOpen(false)
  }, [])

  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeTour()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeTour, isOpen])

  const goToAction = () => {
    localStorage.setItem(storageKey, 'true')
    setIsOpen(false)
    navigate(activeStep.actionPath)
  }

  const goBack = () => {
    setActiveIndex((currentIndex) => Math.max(currentIndex - 1, 0))
  }

  const goNext = () => {
    setActiveIndex((currentIndex) => Math.min(currentIndex + 1, demoSteps.length - 1))
  }

  return (
    <>
      <button
        type="button"
        onClick={openTour}
        className="fixed bottom-36 right-4 z-[70] inline-flex items-center gap-2 rounded-full border border-amber-200 bg-primary px-4 py-3 text-xs font-extrabold text-white shadow-[0_18px_50px_rgba(15,23,42,0.24)] transition hover:-translate-y-0.5 hover:bg-charcoal sm:bottom-6 sm:right-6 sm:text-sm"
        aria-label="Open Demo Tour"
      >
        <Sparkles size={16} className="text-accent" />
        <span className="hidden sm:inline">Demo Tour</span>
        <span className="sm:hidden">Tour</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/55 px-3 py-4 backdrop-blur-sm sm:items-center sm:px-6">
          <section
            className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.34)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-tour-title"
          >
            <div className="bg-primary px-5 py-5 text-white sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-accent">
                    <BadgeInfo size={15} />
                    Judge Demo Tour
                  </p>
                  <h2 id="demo-tour-title" className="mt-2 text-2xl font-extrabold sm:text-3xl">
                    {activeStep.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeTour}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
                  aria-label="Close Demo Tour"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-bold text-white/70">
                  <span>{activeStep.eyebrow}</span>
                  <span>
                    {activeIndex + 1}/{demoSteps.length}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full rounded-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>

            <div className="grid max-h-[calc(92vh-13rem)] gap-5 overflow-y-auto p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_240px]">
              <div>
                <p className="text-sm leading-7 text-slate-600">{activeStep.description}</p>

                {activeStep.bullets && (
                  <ul className="mt-5 space-y-3">
                    {activeStep.bullets.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                        <CheckCircle2 size={17} className="mt-1 shrink-0 text-emerald-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeStep.accounts && (
                  <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                    <div className="grid grid-cols-[80px_minmax(0,1fr)_110px] bg-surface px-3 py-2 text-xs font-extrabold uppercase text-slate-500 sm:grid-cols-[100px_minmax(0,1fr)_130px]">
                      <span>Role</span>
                      <span>Email</span>
                      <span>Password</span>
                    </div>
                    {activeStep.accounts.map(([role, email, password]) => (
                      <div
                        key={email}
                        className="grid grid-cols-[80px_minmax(0,1fr)_110px] gap-2 border-t border-slate-100 px-3 py-3 text-xs sm:grid-cols-[100px_minmax(0,1fr)_130px] sm:text-sm"
                      >
                        <span className="font-extrabold text-primary">{role}</span>
                        <span className="min-w-0 truncate font-semibold text-slate-700">{email}</span>
                        <span className="font-bold text-slate-600">{password}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <aside className="rounded-2xl bg-surface p-4">
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Suggested action</p>
                <button
                  type="button"
                  onClick={goToAction}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-extrabold text-primary transition hover:bg-amber-400"
                >
                  {activeStep.actionLabel}
                  <ExternalLink size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem(storageKey, 'true')
                    setIsOpen(false)
                    navigate('/')
                  }}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-primary transition hover:border-accent"
                >
                  Go to Homepage
                </button>
              </aside>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={goBack}
                disabled={activeIndex === 0}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-primary transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              {activeIndex === demoSteps.length - 1 ? (
                <button
                  type="button"
                  onClick={closeTour}
                  className="rounded-xl bg-primary px-5 py-2 text-sm font-extrabold text-white transition hover:bg-charcoal"
                >
                  Finish
                </button>
              ) : (
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-extrabold text-white transition hover:bg-charcoal"
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  )
}

export default DemoTour
