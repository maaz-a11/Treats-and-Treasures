import { useRef, useEffect } from 'react'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion, AnimatePresence } from 'framer-motion'
import type { CakeLayer } from '../../hooks/useCakeBuilder'

// ---------------------------------------------------------------------------
// Sortable layer row
// ---------------------------------------------------------------------------
interface SortableLayerRowProps {
  layer: CakeLayer
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
  onToggleVisibility: () => void
}

function SortableLayerRow({ layer, isSelected, onSelect, onRemove, onToggleVisibility }: SortableLayerRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: layer.id })

  useEffect(() => {
    if (isSelected && rowRef.current) {
      rowRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [isSelected])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <motion.div
      ref={(el) => {
        setNodeRef(el)
        if (el) (rowRef as React.MutableRefObject<HTMLDivElement | null>).current = el
      }}
      style={style}
      layout
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: isDragging ? 0.5 : 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.18 }}
      onClick={onSelect}
      className={`flex items-center gap-2 px-2.5 py-2 rounded-xl cursor-pointer group transition-colors duration-100 min-h-[48px]
        ${isSelected
          ? 'bg-blue-50 border-2 border-blue-300'
          : 'bg-surface border border-primary-light/20 hover:border-primary/30'}`}
    >
      <span
        {...attributes}
        {...listeners}
        onClick={e => e.stopPropagation()}
        className="hidden md:inline text-espresso-light/30 cursor-grab active:cursor-grabbing text-xs flex-shrink-0 hover:text-espresso-light/60 select-none"
      >
        ⠿
      </span>
      <span className="text-base flex-shrink-0">{layer.emoji}</span>
      <span className="font-body text-xs font-medium text-espresso flex-1 truncate">{layer.name}</span>
      <div
        className="w-3.5 h-3.5 rounded-full border border-espresso/15 flex-shrink-0"
        style={{ backgroundColor: layer.color }}
      />
      <button
        onClick={e => { e.stopPropagation(); onToggleVisibility() }}
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm flex-shrink-0 transition-opacity ${layer.visible ? 'opacity-100' : 'opacity-25'}`}
        title={layer.visible ? 'Hide layer' : 'Show layer'}
      >
        👁
      </button>
      <button
        onClick={e => { e.stopPropagation(); onRemove() }}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-[11px] text-espresso-light/30 hover:text-red-400 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
      >
        ✕
      </button>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Main LayerPanel
// ---------------------------------------------------------------------------
interface LayerPanelProps {
  layers: CakeLayer[]
  selectedLayerId: string | null
  cakeName: string
  tierCount: number
  estimatedPrice: number
  onSelectLayer: (id: string | null) => void
  onRemoveLayer: (id: string) => void
  onToggleVisibility: (id: string) => void
  onAddToCart: () => void
}

export default function LayerPanel({
  layers, selectedLayerId, cakeName, tierCount, estimatedPrice,
  onSelectLayer, onRemoveLayer, onToggleVisibility, onAddToCart,
}: LayerPanelProps) {
  const decorationCount = layers.filter(l => l.category !== 'base').length
  const reversedLayers = [...layers].reverse()

  return (
    <div className="flex flex-col h-full bg-background border-l border-primary-light/30 overflow-hidden">
      {/* Layer Stack header */}
      <div className="px-4 pt-4 pb-2 border-b border-primary-light/20 flex-shrink-0">
        <h2 className="font-display text-base font-semibold text-espresso">Layer Stack</h2>
        <p className="font-body text-[11px] text-espresso-light/50 mt-0.5">
          {layers.length} layer{layers.length !== 1 ? 's' : ''} added
        </p>
      </div>

      {/* Scrollable layer list */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5 min-h-0">
        {layers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center py-8">
            <span className="text-3xl opacity-20">📋</span>
            <p className="font-body text-xs text-espresso-light/40 hidden md:block">
              No layers yet — drag items from the shelf
            </p>
            <p className="font-body text-xs text-espresso-light/40 md:hidden">
              Tap 'Base' in the shelf to add layers
            </p>
          </div>
        ) : (
          <SortableContext items={reversedLayers.map(l => l.id)} strategy={verticalListSortingStrategy}>
            <AnimatePresence>
              {reversedLayers.map(layer => (
                <SortableLayerRow
                  key={layer.id}
                  layer={layer}
                  isSelected={selectedLayerId === layer.id}
                  onSelect={() => onSelectLayer(layer.id)}
                  onRemove={() => onRemoveLayer(layer.id)}
                  onToggleVisibility={() => onToggleVisibility(layer.id)}
                />
              ))}
            </AnimatePresence>
          </SortableContext>
        )}
      </div>

      {/* Order summary */}
      <div className="border-t border-primary-light/20 p-4 bg-surface/60 flex-shrink-0 overflow-hidden">
        <h3 className="font-display text-sm font-semibold text-espresso mb-3">Order Summary</h3>

        <div className="flex flex-col gap-1.5 mb-4">
          <div className="flex justify-between items-center">
            <span className="font-body text-xs text-espresso-light">Cake Name</span>
            <span className="font-body text-xs font-medium text-espresso truncate max-w-[140px]">
              {cakeName || '—'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-body text-xs text-espresso-light">Tiers</span>
            <span className="font-body text-xs font-medium text-espresso">{tierCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-body text-xs text-espresso-light">Decorations</span>
            <span className="font-body text-xs font-medium text-espresso">{decorationCount}</span>
          </div>

          <div className="border-t border-primary-light/30 pt-2 mt-1">
            <div className="flex justify-between items-center">
              <span className="font-body text-sm font-semibold text-espresso">Est. Total</span>
              <motion.span
                key={estimatedPrice}
                initial={{ scale: 1.1, color: '#D4956A' }}
                animate={{ scale: 1, color: '#2C1810' }}
                transition={{ duration: 0.25 }}
                className="font-display text-lg font-bold"
              >
                PKR {estimatedPrice.toLocaleString()}
              </motion.span>
            </div>
            <p className="font-body text-[10px] text-espresso-light/50 mt-0.5">
              PKR 1,500/tier · PKR 200/decoration
            </p>
          </div>
        </div>

        <button
          onClick={onAddToCart}
          disabled={layers.length === 0}
          className="btn-accent w-full text-sm py-4 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          🛒 Add to Cart & Order
        </button>
      </div>
    </div>
  )
}
