import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

const PdfModal = ({ pdfUrl, projectLink, isOpen, onClose }) => {
  const [pdfjs, setPdfjs] = useState(() => window.pdfjsLib || null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);

  // Load PDF.js from CDN
  useEffect(() => {
    if (!isOpen) return;

    if (window.pdfjsLib) return;

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;
    script.onload = () => {
      const lib = window.pdfjsLib;
      lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      setPdfjs(lib);
    };
    script.onerror = () => {
      console.error('Failed to load PDF.js');
      setLoading(false);
    };
    document.body.appendChild(script);
  }, [isOpen]);

  // Load the PDF Document
  useEffect(() => {
    if (!pdfjs || !pdfUrl || !isOpen) return;

    const loadingTask = pdfjs.getDocument(pdfUrl);
    loadingTask.promise.then((pdf) => {
      setPdfDoc(pdf);
      setNumPages(pdf.numPages);
      setLoading(false);
    }).catch(err => {
      console.error('Error loading PDF:', err);
      setLoading(false);
    });

    return () => {
      loadingTask.destroy();
    };
  }, [pdfjs, pdfUrl, isOpen]);

  // Render the Page
  useEffect(() => {
    if (!pdfDoc || !isOpen || !canvasRef.current) return;

    let isSubscribed = true;
    
    const renderPage = async (num) => {
      setRendering(true);
      try {
        const page = await pdfDoc.getPage(num);
        if (!isSubscribed) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Adjust scale based on the modal body's dimensions
        const modalBody = canvas.parentElement.parentElement;
        const containerWidth = modalBody ? modalBody.clientWidth - 32 : window.innerWidth * 0.8;
        const containerHeight = modalBody ? modalBody.clientHeight - 32 : window.innerHeight * 0.8;
        
        let unscaledViewport = page.getViewport({ scale: 1 });
        let scaleWidth = containerWidth / unscaledViewport.width;
        let scaleHeight = containerHeight / unscaledViewport.height;
        
        // Scale to fit within the container, preserving aspect ratio
        let scale = Math.min(scaleWidth, scaleHeight);
        
        // Allow it to scale up nicely for presentations
        scale = Math.min(scale, 3);

        const viewport = page.getViewport({ scale });

        // Handle high DPI displays
        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height =  Math.floor(viewport.height) + "px";

        const transform = outputScale !== 1 
          ? [outputScale, 0, 0, outputScale, 0, 0] 
          : null;

        const renderContext = {
          canvasContext: ctx,
          transform: transform,
          viewport: viewport
        };

        if (renderTaskRef.current) {
          await renderTaskRef.current.cancel();
        }

        renderTaskRef.current = page.render(renderContext);
        await renderTaskRef.current.promise;
      } catch (err) {
        if (err.name !== 'RenderingCancelledException') {
          console.error('Error rendering page:', err);
        }
      } finally {
        if (isSubscribed) {
          setRendering(false);
        }
      }
    };

    renderPage(pageNum);

    return () => {
      isSubscribed = false;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfDoc, pageNum, isOpen]);

  // Handle Keyboard Navigation
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && pageNum < numPages && !rendering) {
        setPageNum(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && pageNum > 1 && !rendering) {
        setPageNum(prev => prev - 1);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, pageNum, numPages, rendering, onClose]);

  const goToNextPage = () => {
    if (pageNum < numPages && !rendering) setPageNum(pageNum + 1);
  };

  const goToPrevPage = () => {
    if (pageNum > 1 && !rendering) setPageNum(pageNum - 1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/85" 
            onClick={onClose} 
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative flex h-full w-full flex-col overflow-hidden bg-surface-card sm:h-[85vh] sm:w-[90vw] sm:max-w-6xl sm:rounded-lg sm:border sm:border-hairline"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-slides-title"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-hairline bg-surface-card px-4 py-3 sm:px-6 sm:py-4">
              <div className="flex items-center gap-2 sm:gap-4">
                <h3 id="project-slides-title" className="text-base font-semibold text-ink sm:text-lg">Project Slides</h3>
                {!loading && numPages > 0 && (
                  <span className="rounded-xs border border-hairline-strong px-2 py-1 font-code text-[10px] text-primary sm:px-3 sm:text-xs">
                    {pageNum}/{numPages}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-1 sm:gap-2">
                {projectLink && (
                  <a 
                    href={projectLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                    title="View on GitHub"
                  >
                    <FaGithub size={20} />
                  </a>
                )}
                <a 
                  href={pdfUrl} 
                  download 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                  title="Download PDF"
                >
                  <Download size={20} />
                </a>
                <button 
                  type="button"
                  onClick={onClose}
                  aria-label="Close project slides"
                  className="rounded-md p-2 text-muted transition-colors hover:bg-surface-elevated hover:text-ink"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="relative flex flex-grow flex-col items-center justify-center overflow-hidden bg-canvas p-1 sm:p-4">
              
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-10 backdrop-blur-sm">
                  <Loader2 size={48} className="text-primary animate-spin mb-4" />
                  <p className="text-slate-300 font-medium animate-pulse">Loading Slides...</p>
                </div>
              )}

              <div className="relative shadow-2xl rounded-lg overflow-hidden bg-white/5 transition-opacity duration-300">
                {rendering && !loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 z-10 backdrop-blur-[2px]">
                    <Loader2 size={32} className="text-primary animate-spin" />
                  </div>
                )}
                <canvas 
                  ref={canvasRef} 
                  className="max-w-full h-auto mx-auto select-none"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-t border-slate-800 bg-slate-900/50">
              <button
                onClick={goToPrevPage}
                disabled={pageNum <= 1 || loading || rendering}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-all"
              >
                <ChevronLeft size={18} />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Progress indicator dots (optional visual flair for short decks) */}
              {!loading && numPages > 0 && numPages <= 15 && (
                <div className="hidden md:flex items-center gap-1.5">
                  {Array.from(new Array(numPages)).map((_, index) => (
                    <div 
                      key={index} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${index + 1 === pageNum ? 'w-6 bg-primary' : 'w-1.5 bg-slate-700'}`}
                    />
                  ))}
                </div>
              )}

              <button
                onClick={goToNextPage}
                disabled={pageNum >= numPages || loading || rendering}
                className="flex items-center gap-1 rounded-full bg-primary px-3 py-2 text-xs font-medium text-on-primary shadow-lg shadow-primary/20 transition-all hover:bg-primary-active disabled:cursor-not-allowed disabled:bg-primary-disabled disabled:text-muted sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
              >
                <span className="hidden sm:inline">Next Slide</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PdfModal;
