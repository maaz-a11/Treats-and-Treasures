import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEOHead from '../components/SEOHead'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FDF6F0] flex flex-col">
      <SEOHead title="Page Not Found" description="This page doesn't exist. Browse our cakes and cupcakes in Karachi." />
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-5 max-w-sm"
        >
          <motion.span
            className="text-7xl"
            animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            🎂
          </motion.span>

          <div>
            <h1 className="font-display text-4xl font-bold text-[#2C1810] mb-2">
              Page Not Found
            </h1>
            <p className="font-body text-base text-[#5C3D2E] leading-relaxed">
              Looks like this cake doesn't exist yet. Let's get you back to something delicious.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
            <Link
              to="/"
              className="flex-1 font-body font-semibold text-sm text-[#2C1810] bg-[#F2A7BB]
                         py-3 rounded-2xl hover:bg-[#D4728A] hover:text-white transition-all text-center"
            >
              Go Home
            </Link>
            <Link
              to="/catalogue"
              className="flex-1 font-body font-semibold text-sm text-[#2C1810] border-2
                         border-[#2C1810]/15 py-3 rounded-2xl hover:border-[#2C1810]/30 transition-all text-center"
            >
              Browse Cakes
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
