import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'

const navLinks = [
  { label: 'Home',             to: '/',              match: (p: string) => p === '/' },
  { label: 'Our Cakes',        to: '/catalogue',     match: (p: string) => p.startsWith('/catalogue') },
  { label: 'Design Your Cake', to: '/builder',       match: (p: string) => p.startsWith('/builder') },
  { label: 'Cupcakes',         to: '/cupcakes',      match: (p: string) => p.startsWith('/cupcakes') },
  { label: 'How It Works',     to: '/#how-it-works', match: () => false },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const location                  = useLocation()
  const { totalItems }            = useCart()
  const menuRef                   = useRef<HTMLDivElement>(null)
  const btnRef                    = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close on route change
  useEffect(() => { setMenuOpen(false) }, [location])

  // Close on outside click
  useEffect(() => {
    if (!menuOpen) return
    function handleOutside(e: MouseEvent) {
      if (
        menuRef.current  && !menuRef.current.contains(e.target as Node) &&
        btnRef.current   && !btnRef.current.contains(e.target as Node)
      ) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [menuOpen])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-surface/80 backdrop-blur-md shadow-soft border-b border-primary-light/20' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <span className="text-2xl">🎂</span>
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl text-espresso font-bold tracking-tight group-hover:text-primary-dark transition-colors">
                  Treats
                </span>
                <span className="font-display text-xs text-accent tracking-widest uppercase font-semibold">
                  & Treasures
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-5 lg:gap-7">
              {navLinks.map(link => {
                const isActive = link.match(location.pathname)
                return (
                  <Link key={link.label} to={link.to}
                    className={`font-body text-sm font-medium transition-colors duration-200 relative group whitespace-nowrap
                      ${isActive ? 'text-primary-dark' : 'text-espresso-light hover:text-espresso'}`}>
                    {link.label}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary rounded-full transition-all duration-300
                      ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </Link>
                )
              })}
              <Link to="/order" className="btn-accent text-sm px-5 py-2.5 relative">
                Order Now ✨
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-soft">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile: cart pill + hamburger */}
            <div className="md:hidden flex items-center gap-1">
              {totalItems > 0 && (
                <Link to="/order"
                  className="flex items-center gap-1.5 bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-full min-h-[44px]">
                  <span className="text-base">🛒</span>
                  <span className="font-body text-xs font-bold text-accent">{totalItems > 9 ? '9+' : totalItems}</span>
                </Link>
              )}
              <button
                ref={btnRef}
                onClick={() => setMenuOpen(o => !o)}
                className="flex flex-col gap-[5px] p-2.5 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl hover:bg-primary-light/30 transition-colors ml-1"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                <span className={`block w-5 h-0.5 bg-espresso rounded transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                <span className={`block w-5 h-0.5 bg-espresso rounded transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                <span className={`block w-5 h-0.5 bg-espresso rounded transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown — fixed, full-width, overlays content */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden bg-surface/98 backdrop-blur-md border-b border-primary-light/20 shadow-lg"
          >
            <nav className="flex flex-col">
              {navLinks.map(link => {
                const isActive = link.match(location.pathname)
                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={`font-body text-base font-medium px-6 py-3 border-b border-primary-light/10 transition-colors
                      ${isActive
                        ? 'bg-primary-light/20 text-espresso font-semibold'
                        : 'text-espresso-light hover:bg-primary-light/10 hover:text-espresso'}`}
                  >
                    {link.label}
                  </Link>
                )
              })}
              <div className="px-4 py-3 pb-safe">
                <Link
                  to="/order"
                  onClick={() => setMenuOpen(false)}
                  className="btn-accent block text-center w-full"
                >
                  Order Now ✨
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
