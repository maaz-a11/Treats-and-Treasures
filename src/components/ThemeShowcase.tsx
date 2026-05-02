import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CAKE_CATEGORIES } from '../data/cakeCategories'

const LIGHT_SLUGS = ['wedding', 'engagement', 'baby-shower', 'bridal-shower']

function getTextColor(slug: string) {
  return LIGHT_SLUGS.includes(slug) ? 'text-espresso' : 'text-white'
}

// Duplicate for seamless scroll loop
const allCategories = [...CAKE_CATEGORIES, ...CAKE_CATEGORIES]

export default function ThemeShowcase() {
  return (
    <section className="py-24 bg-blush/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="font-body text-sm font-semibold text-accent tracking-widest uppercase mb-3 block">
            Every Occasion
          </span>
          <h2 className="section-heading mb-4">
            A cake for{' '}
            <span className="italic text-gradient">every moment</span>
          </h2>
          <p className="section-subtext max-w-lg mx-auto">
            Browse our themed collections or start completely from scratch — it's your cake.
          </p>
        </motion.div>
      </div>

      {/* Auto-scrolling strip */}
      <div className="pause-on-hover overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-blush/30 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-blush/30 to-transparent z-10 pointer-events-none" />

        <div className="flex gap-4 animate-scroll-left w-max px-4">
          {allCategories.map((cat, i) => {
            const textColor = getTextColor(cat.slug)
            const isLight = LIGHT_SLUGS.includes(cat.slug)
            return (
              <Link
                key={`${cat.id}-${i}`}
                to={`/catalogue?category=${cat.slug}`}
                className={`flex-shrink-0 w-44 h-56 md:w-52 md:h-64 min-h-[240px] bg-gradient-to-br ${cat.gradient}
                             rounded-3xl shadow-card flex flex-col justify-between p-5
                             group relative overflow-hidden hover:shadow-hover hover:-translate-y-1
                             transition-all duration-300`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 rounded-3xl" />

                {/* Category tag */}
                <div>
                  <span className={`font-body text-xs font-semibold ${textColor} opacity-70 tracking-wider uppercase`}>
                    {cat.description.split('—')[0].trim().split(' ').slice(0, 2).join(' ')}
                  </span>
                </div>

                {/* Emoji */}
                <div className="text-5xl text-center group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 leading-none">
                  {cat.emoji}
                </div>

                {/* Name + CTA */}
                <div className="flex flex-col gap-2">
                  <h3 className={`font-display text-xl font-bold ${textColor} leading-tight`}>
                    {cat.name}
                  </h3>
                  {/* span instead of Link — entire card is already a link */}
                  <span
                    className={`font-body text-xs font-semibold ${textColor} border
                      ${isLight ? 'border-espresso/20 group-hover:bg-espresso/10' : 'border-white/40 group-hover:bg-white/20'}
                      rounded-full px-3 py-1.5 text-center transition-colors w-fit`}
                  >
                    Explore →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 text-center">
        <Link to="/catalogue" className="btn-primary inline-flex items-center gap-2">
          Browse All Cakes
          <span>→</span>
        </Link>
      </div>
    </section>
  )
}
