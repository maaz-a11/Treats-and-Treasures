import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const floatingBadges = [
  { emoji: '🍓', label: 'Strawberry', top: '15%', left: '10%', delay: 0,   mobileHide: false },
  { emoji: '🌸', label: 'Floral',     top: '70%', left: '5%',  delay: 0.4, mobileHide: true  },
  { emoji: '✨', label: 'Sparkle',    top: '20%', right: '8%', delay: 0.8, mobileHide: false },
  { emoji: '🎀', label: 'Ribbon',     top: '75%', right: '5%', delay: 0.2, mobileHide: true  },
]

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-background">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-light/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent-light/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blush/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left — Text Content */}
          <div className="flex flex-col gap-6">
            {/* Delivery badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-primary-light/60 border border-primary/40 text-espresso-light text-sm font-body font-medium px-4 py-2 rounded-full w-fit"
            >
              <span>🎂</span>
              <span>Karachi Delivery Only</span>
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-espresso leading-[1.05] tracking-tight">
                Design Your{' '}
                <span className="italic text-gradient">Dream</span>
                <br />
                Cake.
              </h1>
            </motion.div>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-body text-lg text-espresso-light leading-relaxed max-w-md"
            >
              Karachi's most personal cake studio — built for your moment.
              Every layer, flavor, and swirl, exactly how you imagined it.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 pt-2 w-full sm:w-auto"
            >
              <Link to="/builder" className="btn-primary text-center text-base px-8 py-3.5 w-full sm:w-auto">
                Start Designing 🎨
              </Link>
              <Link to="/catalogue" className="btn-ghost text-center text-base px-8 py-3.5 w-full sm:w-auto">
                Browse Cakes
              </Link>
            </motion.div>

            {/* Cupcakes nudge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.42 }}
            >
              <Link
                to="/cupcakes"
                className="font-body text-sm text-espresso-light hover:text-accent transition-colors"
              >
                🧁 Looking for cupcakes? →
              </Link>
            </motion.div>

            {/* Social proof strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-4 pt-2"
            >
              <div className="flex -space-x-2">
                {['#F2A7BB', '#D4956A', '#A8693E', '#D4728A'].map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-surface flex items-center justify-center text-xs"
                    style={{ backgroundColor: color }}
                  >
                    <span>😊</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-espresso">500+ happy customers</p>
                <p className="font-body text-xs text-espresso-light">across Karachi 🇵🇰</p>
              </div>
            </motion.div>
          </div>

          {/* Right — 3D Cake Preview Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            {/* Floating decoration badges */}
            {floatingBadges.map((badge, i) => (
              <motion.div
                key={i}
                className={`absolute z-10 bg-surface/90 backdrop-blur-sm border border-primary-light/40 rounded-2xl px-3 py-2 shadow-card flex items-center gap-1.5 ${badge.mobileHide ? 'hidden sm:flex' : 'flex'}`}
                style={{
                  top: badge.top,
                  left: badge.left,
                  right: (badge as { right?: string }).right,
                }}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  delay: badge.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <span className="text-base">{badge.emoji}</span>
                <span className="font-body text-xs font-medium text-espresso-light">{badge.label}</span>
              </motion.div>
            ))}

            {/* 3D Cake Canvas Placeholder */}
            <div className="relative w-full max-w-sm lg:max-w-md aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-light/50 via-blush/60 to-accent-light/40 rounded-4xl shadow-hover" />
              <div className="absolute inset-4 bg-surface/60 backdrop-blur-sm rounded-3xl border border-primary-light/30 flex flex-col items-center justify-center gap-4">
                {/* Placeholder cake illustration using CSS */}
                <div className="flex flex-col items-center gap-2">
                  {/* Tier 3 */}
                  <div className="w-20 h-10 bg-gradient-to-b from-primary-light to-primary rounded-2xl relative shadow-soft">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-1 h-4 bg-accent rounded-full" />
                      ))}
                    </div>
                    <div className="absolute inset-x-1 top-1 flex gap-1 justify-center">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-white/60 rounded-full" />
                      ))}
                    </div>
                  </div>
                  {/* Tier 2 */}
                  <div className="w-32 h-12 bg-gradient-to-b from-accent-light to-accent rounded-2xl shadow-soft relative">
                    <div className="absolute inset-x-2 top-2 flex gap-1 justify-center">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-white/50 rounded-full" />
                      ))}
                    </div>
                  </div>
                  {/* Tier 1 */}
                  <div className="w-44 h-14 bg-gradient-to-b from-primary to-primary-dark rounded-2xl shadow-hover relative">
                    <div className="absolute inset-x-2 top-2 flex gap-1.5 justify-center">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-2.5 h-2.5 bg-white/40 rounded-full" />
                      ))}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-3 bg-primary-dark/30 rounded-b-2xl" />
                  </div>
                  {/* Plate */}
                  <div className="w-52 h-4 bg-gradient-to-r from-cream via-surface to-cream rounded-full shadow-soft" />
                </div>

                <div className="text-center px-4">
                  <p className="font-body text-xs text-espresso-light/60 font-medium">
                    Interactive 3D Preview
                  </p>
                  <p className="font-body text-xs text-primary-dark font-semibold">
                    Coming Day 3 🎂
                  </p>
                </div>
              </div>
              {/* Three.js canvas mounts here Day 3 */}
              {/* <canvas id="cake-3d-canvas" className="absolute inset-0 w-full h-full rounded-3xl" /> */}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="font-body text-xs text-espresso-light/50 tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-primary-light to-transparent" />
      </motion.div>
    </section>
  )
}
