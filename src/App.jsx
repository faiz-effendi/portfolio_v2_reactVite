import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import SiteLayout from './layouts/SiteLayout'
import NotFoundPage from './pages/NotFoundPage'
import PortfolioPage from './pages/PortfolioPage'

const SarangNagaPage = lazy(() => import('./pages/SarangNagaPage'))

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<PortfolioPage />} />
        <Route
          path="sarang-naga"
          element={
            <Suspense fallback={<main className="min-h-screen pt-16" aria-busy="true" />}>
              <SarangNagaPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
