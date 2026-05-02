import { motion } from 'framer-motion'

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3
}

const STEPS = [
  { number: 1, label: 'Cart' },
  { number: 2, label: 'Delivery' },
  { number: 3, label: 'Payment' },
]

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center w-full">
      {STEPS.map((step, idx) => {
        const isDone   = step.number < currentStep
        const isActive = step.number === currentStep

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  backgroundColor: isDone ? '#D4956A' : isActive ? '#F2A7BB' : 'transparent',
                  borderColor:     isDone ? '#D4956A' : isActive ? '#F2A7BB' : 'rgba(44,24,16,0.2)',
                  scale:           isActive ? 1.08 : 1,
                }}
                transition={{ duration: 0.25 }}
                className="w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0"
              >
                {isDone ? (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="text-white text-sm font-bold">✓</motion.span>
                ) : (
                  <span className="text-sm font-bold"
                    style={{ color: isActive ? '#2C1810' : 'rgba(44,24,16,0.35)' }}>
                    {step.number}
                  </span>
                )}
              </motion.div>
              <span className="font-body text-[11px] font-semibold whitespace-nowrap hidden sm:block"
                style={{ color: isActive || isDone ? '#2C1810' : 'rgba(44,24,16,0.35)' }}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className="relative mx-2 sm:mx-4 mb-5 sm:mb-0 flex-shrink-0" style={{ width: 56 }}>
                <div className="h-0.5 w-full rounded-full" style={{ backgroundColor: 'rgba(44,24,16,0.12)' }} />
                <motion.div className="absolute top-0 left-0 h-0.5 rounded-full"
                  style={{ backgroundColor: '#D4956A' }}
                  animate={{ width: isDone ? '100%' : '0%' }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
