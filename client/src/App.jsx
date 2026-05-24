import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/common/ProtectedRoute'
import PageLoader from './components/common/PageLoader'

const AdminPanel = lazy(() => import('./pages/AdminPanel/AdminPanel'))
const AgentProfile = lazy(() => import('./pages/AgentProfile/AgentProfile'))
const Agents = lazy(() => import('./pages/Agents/Agents'))
const Buy = lazy(() => import('./pages/Buy/Buy'))
const CityLanding = lazy(() => import('./pages/CityLanding/CityLanding'))
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'))
const Home = lazy(() => import('./pages/Home/Home'))
const HomeValue = lazy(() => import('./pages/HomeValue/HomeValue'))
const Login = lazy(() => import('./pages/Login/Login'))
const Mortgage = lazy(() => import('./pages/Mortgage/Mortgage'))
const Properties = lazy(() => import('./pages/Properties/Properties'))
const PropertyDetail = lazy(() => import('./pages/PropertyDetail/PropertyDetail'))
const Register = lazy(() => import('./pages/Register/Register'))
const Rent = lazy(() => import('./pages/Rent/Rent'))
const Sell = lazy(() => import('./pages/Sell/Sell'))
const SellerDashboard = lazy(() => import('./pages/SellerDashboard/SellerDashboard'))

function RouteBoundary({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<RouteBoundary><Home /></RouteBoundary>} />
        <Route path="/buy" element={<RouteBoundary><Buy /></RouteBoundary>} />
        <Route path="/rent" element={<RouteBoundary><Rent /></RouteBoundary>} />
        <Route path="/sell" element={<RouteBoundary><Sell /></RouteBoundary>} />
        <Route path="/mortgage" element={<RouteBoundary><Mortgage /></RouteBoundary>} />
        <Route path="/agents" element={<RouteBoundary><Agents /></RouteBoundary>} />
        <Route path="/agents/:agentId" element={<RouteBoundary><AgentProfile /></RouteBoundary>} />
        <Route path="/home-value" element={<RouteBoundary><HomeValue /></RouteBoundary>} />
        <Route path="/city/:citySlug" element={<RouteBoundary><CityLanding /></RouteBoundary>} />
        <Route path="/properties" element={<RouteBoundary><Properties /></RouteBoundary>} />
        <Route path="/properties/:id" element={<RouteBoundary><PropertyDetail /></RouteBoundary>} />
        <Route path="/login" element={<RouteBoundary><Login /></RouteBoundary>} />
        <Route path="/register" element={<RouteBoundary><Register /></RouteBoundary>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RouteBoundary><Dashboard /></RouteBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/seller"
          element={
            <ProtectedRoute>
              <RouteBoundary><SellerDashboard /></RouteBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RouteBoundary><AdminPanel /></RouteBoundary>
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
