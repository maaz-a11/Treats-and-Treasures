import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FALLBACK_IMAGE, type CakeProduct } from '../../data/cakeProducts'
import { CAKE_CATEGORIES } from '../../data/cakeCategories'

interface CakeCardProps {
  product: CakeProduct
  onOrderClick: (product: CakeProduct) => void
  index: number
}

export default function CakeCard({ product, onOrderClick, index }: CakeCardProps) {
  const [imgError, setImgError] = useState(false)
  const category = CAKE_CATEGORIES.find(c => c.id === product.categoryId)
  const lowestPrice = Math.min(...product.poundOptions.map(o => o.pricePKR))

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.055, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col bg-[#FFFAF7] rounded-[20px] overflow-hidden
                 border border-[#F2A7BB]/20 shadow-[0_2px_16px_rgba(44,24,16,0.06)]
                 hover:shadow-[0_8px_40px_rgba(44,24,16,0.14)] hover:-translate-y-1
                 transition-all duration-300"
    >
      {/* ── IMAGE ── paddingBottom 75% = 4:3, never collapses even on error */}
      <div className="relative w-full overflow-hidden bg-[#F5EDE8]" style={{ paddingBottom: '75%' }}>
        <img
          src={imgError ? FALLBACK_IMAGE : product.image}
          alt={product.name}
          loading={index < 6 ? 'eager' : 'lazy'}
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover
                     group-hover:scale-[1.04] transition-transform duration-500"
          onError={() => setImgError(true)}
        />

        {/* Gradient scrim — improves badge legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />

        {/* Category badge */}
        {category && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 font-body text-[11px] font-semibold
                             bg-white/90 backdrop-blur-sm text-[#2C1810]
                             px-2.5 py-1 rounded-full border border-white/40 shadow-sm">
              {category.emoji} {category.name}
            </span>
          </div>
        )}

        {/* Popular badge */}
        {product.popular && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 font-body text-[10px] font-bold
                             bg-[#D4AF37] text-white px-2.5 py-1 rounded-full
                             shadow-sm tracking-wide uppercase">
              ⭐ Popular
            </span>
          </div>
        )}
      </div>

      {/* ── CONTENT ── */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">

        {/* Title + description */}
        <div>
          <h3 className="font-display text-[17px] font-semibold text-[#2C1810] leading-snug line-clamp-1">
            {product.name}
          </h3>
          <p className="font-body text-xs text-[#2C1810]/70 mt-1 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Tags row */}
        <div className="flex flex-wrap gap-1.5">
          <span className="font-body text-[10px] font-semibold bg-[#F2A7BB]/30 text-[#5C3D2E] px-2 py-0.5 rounded-full">
            {product.flavor}
          </span>
          {product.tags.slice(0, 2).map(tag => (
            <span key={tag}
              className="font-body text-[10px] text-[#2C1810]/45 bg-[#FDF6F0] border border-[#F2A7BB]/20 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Spacer pushes price+CTA to bottom */}
        <div className="flex-1" />

        {/* Price */}
        <div>
          <p className="font-body text-[10px] text-[#2C1810]/40 uppercase tracking-wide">From</p>
          <p className="font-display text-[18px] font-bold text-[#2C1810]">
            PKR {lowestPrice.toLocaleString()}
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-2 mt-0.5">
          <button
            onClick={() => onOrderClick(product)}
            aria-label={`Order ${product.name}`}
            className="flex-1 font-body font-semibold text-sm text-white
                       py-3 rounded-2xl transition-all duration-200
                       hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: '#D4956A' }}
          >
            Order Now
          </button>
          {product.customizable && (
            <Link
              to="/builder"
              title="Customize this cake in the builder"
              aria-label={`Customize ${product.name} in the builder`}
              className="flex-shrink-0 flex items-center justify-center
                         w-11 h-11 rounded-2xl border-2 border-[#2C1810]/15
                         text-[#2C1810]/50 hover:border-[#2C1810]/30 hover:text-[#2C1810]
                         transition-colors text-base"
            >
              ✏️
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  )
}
