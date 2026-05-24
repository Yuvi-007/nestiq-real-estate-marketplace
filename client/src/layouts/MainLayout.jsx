import { Outlet, useLocation } from 'react-router-dom'

import DemoTour from '../components/common/DemoTour'
import Footer from '../components/common/Footer'
import MobileBottomNav from '../components/common/MobileBottomNav'
import Navbar from '../components/common/Navbar'

function MainLayout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const isPropertyDetail = pathname.startsWith('/properties/')

  return (
    <div className="min-h-screen overflow-x-clip bg-surface text-charcoal">
      <Navbar />
      <main
        className={
          isHome
            ? 'min-h-[calc(100vh-9rem)] w-full pb-24 lg:pb-10'
            : `mx-auto min-h-[calc(100vh-9rem)] w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 lg:pb-10 ${
                isPropertyDetail ? 'pb-40 md:pb-10' : 'pb-24'
              }`
        }
      >
        <Outlet />
      </main>
      <Footer />
      <DemoTour />
      <MobileBottomNav />
    </div>
  )
}

export default MainLayout
