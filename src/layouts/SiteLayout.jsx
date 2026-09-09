import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

const SiteLayout = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  return (
    <div className="min-h-screen bg-canvas text-body">
      <Navbar />
      <Outlet />
      <Footer showCta={pathname !== '/sarang-naga'} />
    </div>
  )
}

export default SiteLayout
