import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEOHead from '../components/SEOHead'
import CakeCard from '../components/catalogue/CakeCard'
import SizeModal from '../components/catalogue/SizeModal'
import { CAKE_PRODUCTS, type CakeProduct } from '../data/cakeProducts'
import { SITE_CONFIG } from '../config/siteConfig'

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const cupcakes = CAKE_PRODUCTS.filter(p => p.categoryId === 'cupcakes')

const HOW_STEPS = [
  { num: 1, emoji: '🧁', title: 'Choose Your Flavour',  desc: 'Pick from our signature recipes or go fully custom.' },
  { num: 2, emoji: '📦', title: 'Select Your Box Size', desc: '6, 12, 18, or 24 cupcakes per order — we handle the rest.' },
  { num: 3, emoji: '🚗', title: 'We Deliver Fresh',     desc: 'Same-day delivery available across Karachi.' },
]

const BOX_SIZES = [
  {
    label: 'Box of 6',
    qty: 6,
    serves: 'Serves 3–4',
    bestFor: 'Personal treat or gift',
    emoji: '📦',
    emojiSize: 'text-3xl',
    fromPKR: 600,
    popular: false,
  },
  {
    label: 'Box of 12',
    qty: 12,
    serves: 'Serves 6–8',
    bestFor: 'Birthday party',
    emoji: '📦',
    emojiSize: 'text-4xl',
    fromPKR: 1080,
    popular: true,
  },
  {
    label: 'Box of 18',
    qty: 18,
    serves: 'Serves 9–12',
    bestFor: 'Office or gathering',
    emoji: '📦',
    emojiSize: 'text-5xl',
    fromPKR: 1560,
    popular: false,
  },
  {
    label: 'Box of 24',
    qty: 24,
    serves: 'Serves 12–16',
    bestFor: 'Wedding or large event',
    emoji: '📦',
    emojiSize: 'text-6xl',
    fromPKR: 2040,
    popular: false,
  },
]

const FAQS = [
  {
    q: 'How far in advance should I order?',
    a: 'We recommend ordering at least 24 hours in advance. For large orders (18+ cupcakes) or custom designs, please give us 48–72 hours notice.',
  },
  {
    q: 'Do you deliver across all of Karachi?',
    a: 'Yes! We deliver to all major areas of Karachi including DHA, Clifton, Gulshan, PECHS, North Karachi, and more. Delivery charges vary by zone.',
  },
  {
    q: 'Can I mix flavours in one box?',
    a: 'Absolutely! When placing your order, mention your preferred flavour mix in the Special Instructions field. We\'ll accommodate where possible.',
  },
  {
    q: 'How are the cupcakes packaged?',
    a: 'All cupcakes are packed in premium cupcake boxes with individual holders to prevent movement. We use food-safe packaging that keeps them fresh for 24 hours.',
  },
  {
    q: "What's the minimum order?",
    a: "Our minimum order is 6 cupcakes (one box). There is no maximum — we've fulfilled orders of 200+ cupcakes for corporate events!",
  },
]

const FLOAT_EMOJIS = [
  { delay: 0,    rotate: -8,  scale: 'text-3xl' },
  { delay: 0.3,  rotate:  5,  scale: 'text-5xl' },
  { delay: 0.6,  rotate: -3,  scale: 'text-2xl' },
  { delay: 0.9,  rotate:  10, scale: 'text-4xl' },
  { delay: 0.15, rotate: -12, scale: 'text-3xl' },
  { delay: 0.45, rotate:  6,  scale: 'text-5xl' },
  { delay: 0.75, rotate: -5,  scale: 'text-2xl' },
]

// ─────────────────────────────────────────────────────────────────────────────
// FAQ ACCORDION
// ─────────────────────────────────────────────────────────────────────────────
function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border border-primary-light/25 rounded-2xl overflow-hidden bg-surface">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-body text-sm font-semibold text-espresso">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-accent text-xl font-light leading-none"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p className="font-body text-sm text-espresso-light leading-relaxed px-5 pb-4">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function Cupcakes() {
  const [selectedProduct, setSelectedProduct] = useState<CakeProduct | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Cupcakes"
        description="Freshly baked cupcakes delivered in Karachi. Order boxes of 6, 12, 18 or 24. Vanilla, red velvet, chocolate and custom flavours."
        url="/cupcakes"
      />
      <Navbar />

      {/* ── SECTION 1: HERO ── */}
      <section className="relative pt-28 pb-16 overflow-hidden bg-gradient-to-r from-[#FDF6F0] via-[#FDE8EF] to-[#FDF6F0]">
        {/* Blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary-light/40 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-accent-light/25 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Delivery badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 bg-primary-light/60 border border-primary/30
                       text-espresso-light text-xs font-body font-semibold px-4 py-1.5 rounded-full mb-5"
          >
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            Karachi Delivery Only
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-espresso leading-[1.05] tracking-tight mb-5"
          >
            Karachi's{' '}
            <span className="italic text-gradient">Sweetest</span>
            <br />Cupcakes
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body text-base sm:text-lg text-espresso-light leading-relaxed max-w-xl mx-auto mb-6"
          >
            Individually crafted, freshly baked, delivered to your door.
            Perfect for parties, gifting, or just treating yourself.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex items-center justify-center gap-6 mb-8 flex-wrap"
          >
            {[
              { icon: '🧁', text: 'Baked Fresh Daily' },
              { icon: '📦', text: 'Min. order: 6 cupcakes' },
            ].map(s => (
              <span key={s.text}
                className="font-body text-sm font-semibold text-espresso-light bg-surface/80
                           border border-primary-light/30 px-4 py-1.5 rounded-full flex items-center gap-1.5">
                <span>{s.icon}</span> {s.text}
              </span>
            ))}
          </motion.div>

          {/* Floating emoji strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex items-end justify-center gap-3 h-16"
          >
            {FLOAT_EMOJIS.map((e, i) => (
              <span
                key={i}
                className={`${e.scale} animate-float leading-none select-none ${i >= 5 ? 'hidden sm:inline' : ''}`}
                style={{
                  animationDelay: `${e.delay}s`,
                  transform: `rotate(${e.rotate}deg)`,
                  display: i >= 5 ? undefined : 'inline-block',
                }}
              >
                🧁
              </span>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8"
          >
            <a href="#menu" className="btn-accent px-8 py-3.5 text-base inline-block">
              View Our Menu ↓
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 2: HOW IT WORKS ── */}
      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl text-espresso font-semibold text-center mb-10"
          >
            How cupcake ordering works
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HOW_STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="bg-surface border border-primary-light/25 rounded-3xl p-6 flex flex-col gap-3 shadow-card"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center
                                  font-body font-bold text-sm flex-shrink-0">
                    {step.num}
                  </div>
                  <span className="text-2xl">{step.emoji}</span>
                </div>
                <h3 className="font-display text-lg font-semibold text-espresso">{step.title}</h3>
                <p className="font-body text-sm text-espresso-light leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: MENU ── */}
      <section id="menu" className="py-16 bg-blush/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <span className="font-body text-xs font-semibold text-accent tracking-widest uppercase block mb-2">
              Fresh Daily
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-espresso font-semibold">
              Our Cupcake Menu
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {cupcakes.map((product, i) => (
              <CakeCard
                key={product.id}
                product={product}
                index={i}
                onOrderClick={setSelectedProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: BOX SIZE GUIDE ── */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl md:text-4xl text-espresso font-semibold mb-2">
              Choose Your Box Size
            </h2>
            <p className="font-body text-sm text-espresso-light">
              Not sure how many to order? Use this guide.
            </p>
          </motion.div>

          {/* Horizontally scrollable on mobile */}
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none">
            {BOX_SIZES.map((box, i) => (
              <motion.div
                key={box.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`flex-shrink-0 w-56 sm:flex-1 snap-start bg-surface rounded-3xl p-6
                             flex flex-col items-center text-center gap-3 shadow-card
                             border-2 transition-all duration-200
                             ${box.popular
                               ? 'border-accent shadow-hover relative'
                               : 'border-primary-light/20 hover:border-primary/30'}`}
              >
                {box.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 font-body text-[10px] font-bold
                                   bg-accent text-white px-3 py-0.5 rounded-full whitespace-nowrap">
                    Most Popular
                  </span>
                )}
                <span className={`${box.emojiSize} leading-none`}>{box.emoji}</span>
                <div>
                  <p className="font-display text-lg font-bold text-espresso">{box.label}</p>
                  <p className="font-body text-xs text-espresso-light mt-0.5">{box.serves}</p>
                </div>
                <p className="font-body text-xs text-espresso-light/70 leading-snug">{box.bestFor}</p>
                <div className="mt-auto pt-2 border-t border-primary-light/20 w-full">
                  <p className="font-body text-[10px] text-espresso-light/50 uppercase tracking-wide">From</p>
                  <p className="font-display text-base font-bold text-accent">
                    PKR {box.fromPKR.toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: CUSTOM CTA ── */}
      <section className="py-16 bg-gradient-to-r from-primary-light/40 to-accent-light/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-5"
          >
            <span className="text-5xl">✨</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-espresso">
              Want Something Unique?
            </h2>
            <p className="font-body text-base text-espresso-light leading-relaxed max-w-xl">
              We create fully custom cupcake boxes — your theme, your colours, your message.
              Perfect for corporate events, weddings, and special occasions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full sm:w-auto">
              <Link to="/order" className="btn-accent px-8 py-3.5 text-base text-center w-full sm:w-auto">
                Order Custom Cupcakes
              </Link>
              <Link to="/builder" className="btn-ghost px-8 py-3.5 text-base text-center w-full sm:w-auto">
                Design in Builder
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 6: FAQ ── */}
      <section className="py-16 bg-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl text-espresso font-semibold text-center mb-8"
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <FaqItem
                  q={faq.q}
                  a={faq.a}
                  open={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="font-body text-sm text-espresso-light/60 text-center mt-8"
          >
            Still have questions?{' '}
            <a href={`https://wa.me/${SITE_CONFIG.whatsappNumber}`} target="_blank" rel="noopener noreferrer"
              className="text-accent hover:underline font-semibold">
              Chat with us on WhatsApp →
            </a>
          </motion.p>
        </div>
      </section>

      <Footer />

      {/* Size Modal */}
      <SizeModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}
