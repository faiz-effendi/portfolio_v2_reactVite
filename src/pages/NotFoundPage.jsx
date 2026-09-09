import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <main className="page-container flex min-h-[70vh] flex-col items-start justify-center pt-16">
    <p className="eyebrow">404 / Route not found</p>
    <h1 className="mt-5 text-5xl font-bold tracking-[-0.05em] text-ink sm:text-7xl">Nothing lives here.</h1>
    <p className="mt-5 max-w-xl text-lg text-muted">The page may have moved, or the address is incomplete.</p>
    <Link to="/" className="button-primary mt-8">
      <ArrowLeft size={17} /> Back to portfolio
    </Link>
  </main>
)

export default NotFoundPage
