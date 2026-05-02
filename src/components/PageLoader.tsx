import { motion } from 'framer-motion'

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 bg-[#FDF6F0] flex items-center justify-center">
      <motion.span
        className="text-5xl select-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        aria-label="Loading"
        role="status"
      >
        🎂
      </motion.span>
    </div>
  )
}
