import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import SEOHead from '../components/SEOHead'
import { SITE_CONFIG } from '../config/siteConfig'

const OWNER_WHATSAPP = SITE_CONFIG.whatsappNumber

interface ConfirmationState {
  orderId: string
  grandTotal: number
  zone: string
  deliveryDate: string
  deliveryTime: string
}

function formatDateDisplay(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })
}

const NEXT_STEPS = [
  { icon: '💬', title: 'WhatsApp Confirmation', desc: "We'll confirm your order via WhatsApp within 30 minutes" },
  { icon: '🧁', title: 'Baked Fresh',           desc: 'Your cake is baked fresh on the morning of your delivery date' },
  { icon: '🚗', title: 'Delivered to You',       desc: 'Our rider delivers to your door anywhere in Karachi' },
]

export default function OrderConfirmation() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const state     = location.state as ConfirmationState | null

  // Redirect if no order state (direct URL access)
  useEffect(() => {
    if (!state?.orderId) {
      navigate('/catalogue', { replace: true })
    }
  }, [state, navigate])

  if (!state?.orderId) return null

  const waMsg = encodeURIComponent(`Hi! I just placed order ${state.orderId} on Treats & Treasures. Can you confirm my order?`)

  return (
    <div className="min-h-screen bg-[#FDF6F0]">
      <SEOHead title="Order Confirmed" description="Your cake order has been placed successfully. We'll confirm via WhatsApp within 30 minutes." url="/order/confirmation" />
      <Navbar />

      <main className="flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-16 text-center">
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
        >
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
            <motion.circle
              cx="48" cy="48" r="44"
              stroke="#D4956A" strokeWidth="4" fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            <motion.path
              d="M 28 50 L 42 64 L 68 34"
              stroke="#D4956A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, delay: 0.55, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-6"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#2C1810] mb-2">
            Order Placed! 🎉
          </h1>
          <p className="font-body text-sm text-[#2C1810]/55 max-w-sm mx-auto">
            Thank you for your order. We've received it and will be in touch shortly.
          </p>
        </motion.div>

        {/* Order ID card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="bg-[#FFFAF7] border border-[#F2A7BB]/25 rounded-2xl px-8 py-5 mb-8 shadow-[0_2px_16px_rgba(44,24,16,0.06)]"
        >
          <p className="font-body text-xs text-[#2C1810]/45 uppercase tracking-widest mb-1">Order ID</p>
          <p className="font-display text-2xl font-bold text-[#D4956A]">{state.orderId}</p>
          <p className="font-body text-xs text-[#2C1810]/45 mt-2">
            {formatDateDisplay(state.deliveryDate)} · {state.deliveryTime}
          </p>
          <p className="font-body text-sm font-semibold text-[#2C1810] mt-1">
            Total: PKR {state.grandTotal.toLocaleString()}
          </p>
        </motion.div>

        {/* What happens next */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="w-full max-w-md mb-10"
        >
          <h2 className="font-body text-xs font-semibold text-[#2C1810]/50 tracking-widest uppercase mb-5">
            What Happens Next?
          </h2>
          <div className="flex flex-col gap-0">
            {NEXT_STEPS.map((s, i) => (
              <div key={i} className="flex gap-4 text-left">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-[#FFFAF7] border-2 border-[#F2A7BB]/40 flex items-center justify-center text-lg flex-shrink-0">
                    {s.icon}
                  </div>
                  {i < NEXT_STEPS.length - 1 && (
                    <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: 'rgba(242,167,187,0.35)', minHeight: 24 }} />
                  )}
                </div>
                <div className="pb-6 pt-1.5">
                  <p className="font-body text-sm font-semibold text-[#2C1810]">{s.title}</p>
                  <p className="font-body text-xs text-[#2C1810]/50 mt-0.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.75 }}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-xs"
        >
          <a
            href={`https://wa.me/${OWNER_WHATSAPP}?text=${waMsg}`}
            target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 font-body font-semibold text-sm text-white py-3 rounded-2xl transition-all hover:opacity-90"
            style={{ backgroundColor: '#25D366' }}
          >
            💬 Track on WhatsApp
          </a>
          <Link to="/catalogue"
            className="flex-1 flex items-center justify-center font-body font-semibold text-sm text-[#2C1810] py-3 rounded-2xl border-2 border-[rgba(44,24,16,0.15)] hover:border-[rgba(44,24,16,0.3)] transition-colors">
            Continue Shopping
          </Link>
        </motion.div>
      </main>
    </div>
  )
}
