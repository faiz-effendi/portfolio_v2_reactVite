import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const links = [
  { label: 'Work', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Capabilities', href: '#capabilities' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-canvas/95">
      <nav className="page-container flex h-16 items-center justify-between" aria-label="Primary navigation">
        <a href="#about" className="font-code text-sm font-semibold text-ink">
          faiz<span className="text-primary">.</span>effendi
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-body hover:text-ink">
              {link.label}
            </a>
          ))}
          <a href="#contact" className="button-primary">Contact</a>
        </div>

        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-md border border-hairline text-ink md:hidden"
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-hairline bg-canvas px-5 py-5 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="rounded-md px-3 py-3 text-body hover:bg-surface-card hover:text-ink">
                {link.label}
              </a>
            ))}
            <a href="#contact" onClick={() => setIsOpen(false)} className="button-primary mt-3">Contact</a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
