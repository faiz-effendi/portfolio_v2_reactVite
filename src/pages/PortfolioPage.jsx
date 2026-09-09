import { useState } from 'react'
import Experience from '../components/Experience'
import Hero from '../components/Hero'
import PdfModal from '../components/PdfModal'
import ProjectSection from '../components/ProjectSection'

const PortfolioPage = () => {
  const [isPdfOpen, setIsPdfOpen] = useState(false)
  const [activePdfUrl, setActivePdfUrl] = useState(null)
  const [activeProjectLink, setActiveProjectLink] = useState(null)

  const handleViewDetails = (project) => {
    setActivePdfUrl(project.pdf || null)
    setActiveProjectLink(project.link || null)
    setIsPdfOpen(true)
  }

  const handleClosePdf = () => {
    setIsPdfOpen(false)
    window.setTimeout(() => {
      setActivePdfUrl(null)
      setActiveProjectLink(null)
    }, 300)
  }

  return (
    <>
      <main>
        <Hero />
        <Experience />
        <ProjectSection onViewDetails={handleViewDetails} />
      </main>
      <PdfModal
        key={activePdfUrl || 'closed'}
        isOpen={isPdfOpen}
        pdfUrl={activePdfUrl}
        projectLink={activeProjectLink}
        onClose={handleClosePdf}
      />
    </>
  )
}

export default PortfolioPage
