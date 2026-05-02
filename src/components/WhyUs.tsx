import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const features = [
  {
    emoji: '🎨',
    title: '100% Customizable',
    description: 'Every element — tiers, cream, fondant, toppers — is yours to design exactly as you picture it.',
    bg: 'bg-primary-light/40',
    border: 'border-primary/25',
  },
  {
    emoji: '🌿',
    title: 'Karachi-Fresh Daily',
    description: 'Made fresh the day of your delivery. No frozen ingredients, no shortcuts. Just real, fresh baking.',
    bg: 'bg-accent-light/30',
    border: 'border-accent/20',
  },
  {
    emoji: '⚡',
    title: 'Order in Minutes',
    description: 'Our live builder makes it stupidly easy. Design, customize, and place your order in under 5 minutes.',
    bg: 'bg-blush/60',
    border: 'border-primary/20',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const tileVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function WhyUs() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-light/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="font-body text-sm font-semibold text-accent tracking-widest uppercase mb-3 block">
            Why Choose Us
          </span>
          <h2 className="section-heading">
            The{' '}
            <span className="italic text-gradient">Treats & Treasures</span>{' '}
            difference
          </h2>
        </motion.div>

        {/* Feature tiles */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={tileVariants}
              className={`${feature.bg} border ${feature.border} rounded-3xl p-8 flex flex-col gap-4 group hover:shadow-hover hover:-translate-y-1 transition-all duration-300 text-center`}
            >
              <span className="text-5xl mx-auto group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 block leading-none">
                {feature.emoji}
              </span>
              <h3 className="font-display text-xl text-espresso font-semibold">
                {feature.title}
              </h3>
              <p className="font-body text-sm text-espresso-light leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 flex flex-wrap justify-center gap-6 text-center"
        >
          {[
            { value: '500+', label: 'Happy Customers' },
            { value: '50+', label: 'Cake Designs' },
            { value: '4.9★', label: 'Average Rating' },
            { value: '100%', label: 'Made Fresh' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1 min-w-[100px]">
              <span className="font-display text-3xl font-bold text-gradient">{stat.value}</span>
              <span className="font-body text-xs text-espresso-light font-medium tracking-wide">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
