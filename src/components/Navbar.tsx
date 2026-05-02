import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const navLinks = [
  { label: 'Home',             to: '/',          match: (p: string) => p === '/' },
  { label: 'Our Cakes',        to: '/catalogue', match: (p: string) => p.startsWith('/catalogue') },
  { label: 'Design Your Cake', to: '/builder',   match: (p: string) => p.startsWith('/builder') },
  { label: 'Cupcakes',         to: '/cupcakes',  match: (p: string) => p.startsWith('/cupcakes') },
  { label: 'How It Works',     to: '/#how-it-works', match: () => false },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { totalItems } = useCart()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  return (
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

          {/* Mobile: cart + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            {totalItems > 0 && (
              <Link to="/order" className="relative p-2">
                <span className="text-xl">🛒</span>
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              </Link>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col gap-1.5 p-2 rounded-lg hover:bg-primary-light/30 transition-colors"
              aria-label="Toggle menu" aria-expanded={menuOpen}>
              <span className={`block w-6 h-0.5 bg-espresso rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-espresso rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-espresso rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col gap-1 pt-2">
            {navLinks.map(link => {
              const isActive = link.match(location.pathname)
              return (
                <Link key={link.label} to={link.to}
                  className={`font-body text-sm font-medium px-3 py-2.5 rounded-xl transition-all
                    ${isActive
                      ? 'bg-primary-light/30 text-espresso font-semibold'
                      : 'text-espresso-light hover:text-espresso hover:bg-primary-light/20'}`}>
                  {link.label}
                </Link>
              )
            })}
            <Link to="/order" className="btn-accent text-sm mt-2 text-center">
              Order Now ✨
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
