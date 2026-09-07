import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Experience from './components/Experience'
import ProjectSection from './components/ProjectSection'
import Footer from './components/Footer'
import PdfModal from './components/PdfModal'

function App() {
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [activePdfUrl, setActivePdfUrl] = useState(null);
  const [activeProjectLink, setActiveProjectLink] = useState(null);

  const handleViewDetails = (project) => {
    setActivePdfUrl(project.pdf || null);
    setActiveProjectLink(project.link || null);
    setIsPdfOpen(true);
  };

  const handleClosePdf = () => {
    setIsPdfOpen(false);
    setTimeout(() => {
      setActivePdfUrl(null);
      setActiveProjectLink(null);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-canvas text-body">
      
      <Navbar />
      
      <main>
        <Hero />
        <Experience />
        <ProjectSection onViewDetails={handleViewDetails} />
      </main>

      <Footer />

      {/* Portal-level Modal — rendered at root to escape any overflow/transform constraints */}
      <PdfModal
        key={activePdfUrl || 'closed'}
        isOpen={isPdfOpen}
        pdfUrl={activePdfUrl}
        projectLink={activeProjectLink}
        onClose={handleClosePdf}
      />
    </div>
  )
}

export default App
