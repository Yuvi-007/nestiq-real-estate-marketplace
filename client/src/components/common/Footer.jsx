import { Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
              <Building2 size={20} />
            </span>
            <span className="text-lg font-extrabold text-primary">NestIQ</span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
            A premium MERN real estate platform for discovering, comparing, and managing Indian property listings.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase text-primary">Explore</h2>
          <div className="mt-4 grid gap-3 text-sm text-slate-600">
            <Link to="/buy" className="hover:text-primary">Buy property</Link>
            <Link to="/rent" className="hover:text-primary">Rent property</Link>
            <Link to="/sell" className="hover:text-primary">Sell with NestIQ</Link>
            <Link to="/mortgage" className="hover:text-primary">Home Loan & EMI Center</Link>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase text-primary">Tools</h2>
          <div className="mt-4 grid gap-3 text-sm text-slate-600">
            <Link to="/agents" className="hover:text-primary">Find agents</Link>
            <Link to="/home-value" className="hover:text-primary">Home value estimate</Link>
            <Link to="/login" className="hover:text-primary">Sign in</Link>
            <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase text-primary">Popular Cities</h2>
          <div className="mt-4 grid gap-3 text-sm text-slate-600">
            <Link to="/city/mumbai" className="hover:text-primary">Mumbai</Link>
            <Link to="/city/pune" className="hover:text-primary">Pune</Link>
            <Link to="/city/goa" className="hover:text-primary">Goa</Link>
            <Link to="/city/bangalore" className="hover:text-primary">Bangalore</Link>
            <Link to="/city/delhi" className="hover:text-primary">Delhi</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
