import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Experience from './components/Experience'
import ProjectSection from './components/ProjectSection'
import Footer from './components/Footer'

function App() {
  return (
    <div className="relative min-h-screen">
      {/* Global Background - Dark Base */}
      <div className="fixed inset-0 bg-darker -z-50" />

      {/* Animated Orb 1 — Blue (Top Left) */}
      <div className="orb orb-blue" />
      {/* Animated Orb 2 — Violet (Bottom Right) */}
      <div className="orb orb-violet" />
      {/* Animated Orb 3 — Cyan (Center Right) */}
      <div className="orb orb-cyan" />
      
      <Navbar />
      
      <main>
        <Hero />
        <Experience />
        <ProjectSection />
      </main>

      <Footer />
    </div>
  )
}

export default App
