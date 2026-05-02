import { useState, useEffect } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { motion, AnimatePresence } from 'framer-motion'
import { DECORATION_ITEMS, PRESET_COLORS, TABS, type DecorationItem } from './decorationData'
import type { CakeLayer } from '../../hooks/useCakeBuilder'

// ---------------------------------------------------------------------------
// Draggable item card — desktop only
// ---------------------------------------------------------------------------
interface DraggableItemProps {
  item: DecorationItem
}

function DraggableItem({ item }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: { item },
  })

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-2.5 bg-surface border border-primary-light/30 rounded-xl px-3 py-2.5
        cursor-grab active:cursor-grabbing select-none transition-all duration-150
        hover:border-primary/50 hover:shadow-card
        ${isDragging ? 'opacity-40 scale-95' : 'opacity-100'}`}
    >
      <span className="text-espresso-light/30 text-xs">⠿</span>
      <span className="text-lg leading-none flex-shrink-0">{item.emoji}</span>
      <span className="font-body text-xs font-medium text-espresso leading-tight line-clamp-1">{item.name}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tappable item card — mobile only
// ---------------------------------------------------------------------------
interface TappableItemProps {
  item: DecorationItem
  onTap: (item: DecorationItem) => void
}

function TappableItem({ item, onTap }: TappableItemProps) {
  const [tapped, setTapped] = useState(false)

  function handleTap() {
    onTap(item)
    setTapped(true)
    setTimeout(() => setTapped(false), 1500)
  }

  return (
    <button
      onClick={handleTap}
      className="w-full flex items-center gap-3 bg-surface border border-primary-light/30 rounded-xl px-4 py-3
                 min-h-[52px] active:scale-[0.98] transition-all duration-150
                 hover:border-primary/50 hover:shadow-card text-left"
    >
      <span className="text-xl leading-none flex-shrink-0">{item.emoji}</span>
      <span className="font-body text-sm font-medium text-espresso flex-1 line-clamp-1">{item.name}</span>
      <AnimatePresence>
        {tapped && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex-shrink-0 bg-green-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full"
          >
            ✓ Added
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

// ---------------------------------------------------------------------------
// Color picker tab
// ---------------------------------------------------------------------------
interface ColorPickerTabProps {
  selectedLayerId: string | null
  layers: CakeLayer[]
  onUpdateColor: (id: string, color: string) => void
}

function ColorPickerTab({ selectedLayerId, layers, onUpdateColor }: ColorPickerTabProps) {
  const [customHex, setCustomHex] = useState('#F2A7BB')
  const selectedLayer = layers.find(l => l.id === selectedLayerId)

  useEffect(() => {
    if (selectedLayer?.color) setCustomHex(selectedLayer.color)
  }, [selectedLayer?.color])

  function applyColor(hex: string) {
    if (!selectedLayerId) return
    onUpdateColor(selectedLayerId, hex)
  }

  return (
    <div className="flex flex-col gap-4">
      {selectedLayer ? (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-full border-2 border-white shadow-sm flex-shrink-0"
            style={{ backgroundColor: selectedLayer.color }}
          />
          <div className="flex flex-col min-w-0">
            <span className="font-body text-xs font-semibold text-espresso truncate">{selectedLayer.name}</span>
            <span className="font-body text-[10px] text-espresso-light/60">{selectedLayer.color}</span>
          </div>
        </div>
      ) : (
        <div className="bg-primary-light/10 border border-primary/15 rounded-xl px-3 py-2.5 text-center">
          <p className="font-body text-xs text-espresso-light/60">
            Tap a tier on the canvas to select it
          </p>
        </div>
      )}

      {/* Preset color grid — 5 columns */}
      <div className="grid grid-cols-5 gap-2">
        {PRESET_COLORS.map((c) => (
          <button
            key={c.hex}
            onClick={() => applyColor(c.hex)}
            title={c.name}
            disabled={!selectedLayerId}
            className={`w-full aspect-square rounded-lg border-2 transition-all duration-100 min-h-[44px] md:min-h-0
              ${selectedLayer?.color === c.hex
                ? 'border-blue-400 scale-110 shadow-md'
                : 'border-transparent hover:border-espresso/25 hover:scale-105'}
              ${!selectedLayerId ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            style={{
              backgroundColor: c.hex,
              boxShadow: c.hex === '#FFFFFF' || c.hex === '#FFFFF0' ? 'inset 0 0 0 1px rgba(0,0,0,0.1)' : undefined,
            }}
          />
        ))}
      </div>

      {/* Custom hex */}
      <div className="flex flex-col gap-2">
        <label className="font-body text-xs font-semibold text-espresso-light">Custom Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={customHex}
            onChange={e => { setCustomHex(e.target.value); applyColor(e.target.value) }}
            className="w-12 h-12 rounded-lg border border-primary/20 cursor-pointer bg-transparent flex-shrink-0"
          />
          <input
            type="text"
            value={customHex}
            onChange={e => setCustomHex(e.target.value)}
            onBlur={e => applyColor(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && applyColor(customHex)}
            placeholder="#F2A7BB"
            className="flex-1 font-body text-base bg-surface border border-primary/20 rounded-xl px-3 py-2 text-espresso outline-none focus:border-primary transition-colors min-w-0"
          />
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main shelf
// ---------------------------------------------------------------------------
interface DecorationShelfProps {
  selectedLayerId: string | null
  layers: CakeLayer[]
  onUpdateColor: (id: string, color: string) => void
  activeTab: string
  onTabChange: (tab: string) => void
  onAddItem?: (item: DecorationItem) => void
}

export default function DecorationShelf({
  selectedLayerId, layers, onUpdateColor, activeTab, onTabChange, onAddItem,
}: DecorationShelfProps) {
  const tabItems = DECORATION_ITEMS.filter(item => item.category === activeTab)

  return (
    <div className="flex flex-col h-full bg-background border-r border-primary-light/30 overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 border-b border-primary-light/20 flex-shrink-0">
        <h2 className="font-display text-base font-semibold text-espresso">Decoration Shelf</h2>
        <p className="font-body text-[11px] text-espresso-light/50 mt-0.5 hidden md:block">Drag items onto your cake</p>
        <p className="font-body text-[11px] text-espresso-light/50 mt-0.5 md:hidden">Tap to add to your cake</p>
      </div>

      {/* Tab bar */}
      <div className="flex overflow-x-auto gap-1 px-2 py-2 border-b border-primary-light/20 flex-shrink-0 scrollbar-none">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-150 relative
              ${activeTab === tab.id
                ? 'bg-primary text-espresso shadow-soft'
                : 'text-espresso-light/50 hover:bg-primary-light/30 hover:text-espresso'}`}
          >
            <span className="text-sm leading-none">{tab.emoji}</span>
            <span className="font-body text-[10px] font-medium leading-none whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'colors' ? (
              <ColorPickerTab
                selectedLayerId={selectedLayerId}
                layers={layers}
                onUpdateColor={onUpdateColor}
              />
            ) : (
              <div className="flex flex-col gap-2">
                {tabItems.map(item => (
                  <div key={item.id}>
                    {/* Desktop: draggable */}
                    <div className="hidden md:block">
                      <DraggableItem item={item} />
                    </div>
                    {/* Mobile: tappable */}
                    <div className="md:hidden">
                      <TappableItem item={item} onTap={onAddItem ?? (() => {})} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
