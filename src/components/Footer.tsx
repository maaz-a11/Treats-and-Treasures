import { Link } from 'react-router-dom'
import { SITE_CONFIG } from '../config/siteConfig'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-espresso text-cream py-14 relative overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute -top-20 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎂</span>
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl text-cream font-bold tracking-tight">Treats</span>
                <span className="font-display text-xs text-primary tracking-widest uppercase font-semibold">& Treasures</span>
              </div>
            </div>
            <p className="font-body text-sm text-cream/60 leading-relaxed max-w-xs">
              Karachi's most personal cake studio — every layer, every swirl, built for your moment.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="font-body text-xs text-cream/50 font-medium">Orders for Karachi only</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display text-sm text-cream/80 font-semibold tracking-widest uppercase">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2.5">
              {[
                { label: 'Browse Our Cakes',  to: '/catalogue' },
                { label: 'Cupcakes',          to: '/cupcakes' },
                { label: 'Design Your Cake',  to: '/builder' },
                { label: 'Place an Order',    to: '/order' },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="font-body text-sm text-cream/60 hover:text-primary transition-colors duration-200 w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display text-sm text-cream/80 font-semibold tracking-widest uppercase">
              Say Hello
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href={SITE_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <div className="w-11 h-11 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] rounded-xl flex items-center justify-center text-base flex-shrink-0 group-hover:scale-105 transition-transform">
                  📸
                </div>
                <div>
                  <p className="font-body text-xs text-cream/40 font-medium">Instagram</p>
                  <p className="font-body text-sm text-cream/80 font-medium group-hover:text-primary transition-colors">
                    @{SITE_CONFIG.instagramHandle}
                  </p>
                </div>
              </a>
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <div className="w-11 h-11 bg-[#25D366] rounded-xl flex items-center justify-center text-base flex-shrink-0 group-hover:scale-105 transition-transform">
                  💬
                </div>
                <div>
                  <p className="font-body text-xs text-cream/40 font-medium">WhatsApp</p>
                  <p className="font-body text-sm text-cream/80 font-medium group-hover:text-primary transition-colors">
                    +92 300 1234567
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-3 pb-safe">
          <p className="font-body text-xs text-cream/40">
            © {year} Treats & Treasures. All rights reserved. Made with 💖 in Karachi, Pakistan.
          </p>
          <p className="font-body text-xs text-cream/30">
            Delivery available within Karachi only 🇵🇰
          </p>
        </div>
      </div>
    </footer>
  )
}
