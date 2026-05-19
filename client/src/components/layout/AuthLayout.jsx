import { Building2, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import heroImage from '../../assets/hero.png'

function AuthLayout({ children, eyebrow, title, subtitle }) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
      <div className="grid min-h-[720px] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden overflow-hidden bg-primary lg:block">
          <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-75" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/70 to-accent/50" />
          <div className="relative flex h-full flex-col justify-between p-10 text-white">
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
                <Building2 size={22} />
              </span>
              <span>
                <span className="block text-xl font-extrabold">NestIQ</span>
                <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Private Access</span>
              </span>
            </Link>

            <div className="max-w-lg">
              <div className="mb-5 inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-sm font-bold text-white backdrop-blur">
                <Sparkles size={16} />
                Verified property intelligence
              </div>
              <h1 className="font-display text-5xl font-bold leading-tight">
                Curated homes, sharper decisions, secure accounts.
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-white/80">
                Save homes, manage listing workflows, and keep every property conversation tied to one trusted profile.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm">
              {['Encrypted sessions', 'Verified roles', 'Smart matching'].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-lg bg-white/12 px-3 py-3 backdrop-blur">
                  <ShieldCheck size={16} />
                  <span className="font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link to="/" className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                  <Building2 size={21} />
                </span>
                <span className="text-lg font-extrabold text-primary">NestIQ</span>
              </Link>
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
            <h1 className="mt-3 font-display text-4xl font-bold text-primary">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AuthLayout
