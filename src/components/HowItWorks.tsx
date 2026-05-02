import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const steps = [
  {
    number: 1,
    title: 'Choose Your Base',
    description:
      'Pick your cake size, number of tiers, flavor, and base frosting. We offer vanilla sponge, red velvet, chocolate fudge, and more.',
    emoji: '🍰',
    color: 'from-primary-light/60 to-primary/20',
    border: 'border-primary/30',
    accent: 'bg-primary',
  },
  {
    number: 2,
    title: 'Drag & Drop Your Design',
    description:
      'Layer on whipped cream, fondant work, buttercream swirls, edible prints, and decorations using our live 3D cake builder.',
    emoji: '🎨',
    color: 'from-accent-light/60 to-accent/20',
    border: 'border-accent/30',
    accent: 'bg-accent',
  },
  {
    number: 3,
    title: 'Place Your Order',
    description:
      'Confirm your design, choose a delivery slot in Karachi, pay securely via JazzCash or EasyPaisa, and we handle the rest.',
    emoji: '📦',
    color: 'from-blush/80 to-primary-light/30',
    border: 'border-primary/20',
    accent: 'bg-primary-dark',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="how-it-works" className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary-light/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-light/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-body text-sm font-semibold text-accent tracking-widest uppercase mb-3 block">
            Simple Process
          </span>
          <h2 className="section-heading mb-4">
            From idea to{' '}
            <span className="italic text-gradient">your door</span>
          </h2>
          <p className="section-subtext max-w-xl mx-auto">
            Three steps is all it takes. No bakery queues, no confusion — just your perfect cake.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative"
        >
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40 z-0" />

          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={cardVariants}
              className={`relative card-surface bg-gradient-to-br ${step.color} border ${step.border} p-7 flex flex-col gap-4 group hover:shadow-hover hover:-translate-y-1 transition-all duration-300 z-10`}
            >
              {/* Step number badge */}
              <div className="flex items-start justify-between">
                <div className={`${step.accent} text-white w-10 h-10 rounded-2xl flex items-center justify-center font-display font-bold text-lg shadow-soft`}>
                  {step.number}
                </div>
                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                  {step.emoji}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-xl text-espresso font-semibold leading-tight">
                  {step.title}
                </h3>
                <p className="font-body text-sm text-espresso-light leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-6 right-6 h-0.5 ${step.accent} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
