import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { FALLBACK_IMAGE, type CakeProduct, type PoundOption } from '../../data/cakeProducts'

interface SizeModalProps {
  product: CakeProduct | null
  onClose: () => void
}

export default function SizeModal({ product, onClose }: SizeModalProps) {
  const { addItem } = useCart()
  const [selected, setSelected] = useState<PoundOption | null>(null)
  const [instructions, setInstructions] = useState('')
  const [added, setAdded] = useState(false)

  // Reset state whenever a new product opens
  useEffect(() => {
    if (product) {
      // Default to the second option (1 lb) if available, otherwise first
      setSelected(product.poundOptions[1] ?? product.poundOptions[0] ?? null)
      setInstructions('')
      setAdded(false)
    }
  }, [product?.id]) // only re-run when product ID changes

  // Close on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Prevent body scroll while modal is open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [product])

  function handleAddToCart() {
    if (!product || !selected || added) return

    addItem({
      id: `${product.id}--${selected.pounds}lb`,
      cakeName: `${product.name} (${selected.pounds} lb)`,
      image: product.image,
      pounds: selected.pounds,
      pricePKR: selected.pricePKR,
      specialInstructions: instructions.trim() || undefined,
    })

    setAdded(true)
    // Close after user sees confirmation
    setTimeout(() => onClose(), 1200)
  }

  return (
    <AnimatePresence>
      {product && (
        // Portal-style overlay — covers screen, bottom sheet mobile / centered desktop
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">

          {/* Backdrop — click outside to close */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <motion.div
            key="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sizemodal-title"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full sm:max-w-lg bg-[#FFFAF7] rounded-t-[28px] sm:rounded-[24px]
                       max-h-[92vh] flex flex-col shadow-2xl z-10"
            onClick={e => e.stopPropagation()}
          >
            {/* Success overlay */}
            <AnimatePresence>
              {added && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 bg-[#FFFAF7]/95 flex flex-col items-center justify-center gap-3 rounded-[24px]"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">✓</span>
                  </div>
                  <p className="font-display text-xl text-espresso font-semibold">Added to Cart!</p>
                  <p className="font-body text-sm text-espresso-light/70">{product.name}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Drag handle — mobile only */}
            <div className="flex-shrink-0 flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 bg-[#2C1810]/15 rounded-full" />
            </div>

            {/* ── SCROLLABLE CONTENT ── */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="p-5 md:p-6 flex flex-col gap-5">

                {/* Header: image + name + close */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-[72px] h-[72px] rounded-2xl overflow-hidden border border-[#F2A7BB]/25 bg-[#FDF6F0]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2
                      id="sizemodal-title"
                      className="font-display text-lg font-semibold text-[#2C1810] leading-snug"
                    >
                      {product.name}
                    </h2>
                    <p className="font-body text-xs text-[#2C1810]/55 mt-0.5">
                      {product.flavor} flavour · Karachi delivery
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl
                               hover:bg-[#F2A7BB]/25 text-[#2C1810]/50 hover:text-[#2C1810]
                               transition-colors text-base font-bold"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                {/* Description */}
                <p className="font-body text-sm text-[#2C1810]/70 leading-relaxed -mt-1">
                  {product.description}
                </p>

                {/* ── SIZE SELECTOR ── */}
                <div>
                  <p className="font-body text-[11px] font-semibold text-[#2C1810] tracking-widest uppercase mb-3">
                    Choose Size (Weight)
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {product.poundOptions.map(opt => {
                      const isActive = selected?.pounds === opt.pounds
                      return (
                        <button
                          key={opt.pounds}
                          onClick={() => setSelected(opt)}
                          className="relative text-left p-3 rounded-2xl border-2 transition-all duration-150 focus:outline-none"
                          style={{
                            borderColor: isActive ? '#D4956A' : 'rgba(242,167,187,0.35)',
                            backgroundColor: isActive ? 'rgba(212,149,106,0.07)' : '#FDF6F0',
                          }}
                        >
                          {/* Checkmark */}
                          {isActive && (
                            <span
                              className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                              style={{ backgroundColor: '#D4956A' }}
                            >
                              ✓
                            </span>
                          )}
                          <p className="font-display text-base font-bold text-[#2C1810] pr-6">
                            {opt.pounds} lb
                          </p>
                          <p className="font-body text-sm font-semibold mt-0.5" style={{ color: '#D4956A' }}>
                            PKR {opt.pricePKR.toLocaleString()}
                          </p>
                          <p className="font-body text-[11px] text-[#2C1810]/55 mt-1">
                            {opt.servings}
                          </p>
                          <p className="font-body text-[10px] text-[#2C1810]/40 mt-0.5 leading-snug">
                            {opt.description}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* ── SPECIAL INSTRUCTIONS ── */}
                <div>
                  <label
                    htmlFor="special-instructions"
                    className="font-body text-[11px] font-semibold text-[#2C1810] tracking-widest uppercase block mb-2"
                  >
                    Special Instructions
                    <span className="font-normal text-[#2C1810]/40 normal-case tracking-normal ml-1">(optional)</span>
                  </label>
                  <textarea
                    id="special-instructions"
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                    placeholder="E.g. Write 'Happy Birthday Alisha' on the cake, no nuts, or any special request..."
                    rows={3}
                    className="w-full font-body text-sm rounded-xl px-3 py-2.5 text-[#2C1810] resize-none
                               border border-[#F2A7BB]/30 bg-[#FDF6F0]
                               placeholder-[#2C1810]/30 outline-none
                               focus:border-[#F2A7BB] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* ── STICKY FOOTER — total + CTA ── */}
            <div
              className="flex-shrink-0 px-5 md:px-6 py-4 border-t flex items-center justify-between gap-4"
              style={{ borderColor: 'rgba(242,167,187,0.25)', backgroundColor: '#FFFAF7' }}
            >
              <div>
                <p className="font-body text-[11px] text-[#2C1810]/45 uppercase tracking-wide">Total</p>
                <p className="font-display text-2xl font-bold text-[#2C1810]">
                  PKR {(selected?.pricePKR ?? 0).toLocaleString()}
                </p>
                {selected && (
                  <p className="font-body text-[11px] text-[#2C1810]/40 -mt-0.5">
                    {selected.servings}
                  </p>
                )}
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!selected || added}
                className="flex-shrink-0 font-body font-semibold text-sm text-white
                           px-6 py-3 rounded-2xl transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed
                           hover:opacity-90 active:scale-95"
                style={{ backgroundColor: '#D4956A', minWidth: 140 }}
              >
                {added ? 'Added ✓' : 'Add to Cart 🛒'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
