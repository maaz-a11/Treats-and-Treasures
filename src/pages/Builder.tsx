import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DndContext, DragOverlay, closestCenter,
  type DragEndEvent, type DragStartEvent,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import SEOHead from '../components/SEOHead'
import DecorationShelf from '../components/builder/DecorationShelf'
import CakeCanvas from '../components/builder/CakeCanvas'
import LayerPanel from '../components/builder/LayerPanel'
import MobileTabBar from '../components/builder/MobileTabBar'
import { DECORATION_ITEMS } from '../components/builder/decorationData'
import { useCakeBuilder } from '../hooks/useCakeBuilder'
import { useCart } from '../context/CartContext'

type MobileTab = 'shelf' | 'canvas' | 'layers'

export default function Builder() {
  const [mobileTab, setMobileTab] = useState<MobileTab>('canvas')
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const [saveMsg, setSaveMsg] = useState('')

  const [shelfTab, setShelfTab] = useState('base')

  const navigate = useNavigate()
  const { addItem } = useCart()

  const {
    state,
    addLayer,
    removeLayer,
    reorderLayers,
    selectLayer,
    updateLayerColor,
    toggleLayerVisibility,
    setCakeName,
    undo,
    clearAll,
    saveDesign,
    estimatedPrice,
    tierCount,
  } = useCakeBuilder()

  const activeDragItem = activeDragId
    ? DECORATION_ITEMS.find(i => i.id === activeDragId)
    : null

  function handleDragStart(event: DragStartEvent) {
    setActiveDragId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveDragId(null)
    if (!over) return

    const activeId = String(active.id)
    const overId   = String(over.id)

    if (overId === 'cake-canvas') {
      const item = DECORATION_ITEMS.find(i => i.id === activeId)
      if (item) {
        addLayer(item)
        if (mobileTab !== 'canvas') setMobileTab('canvas')
      }
      return
    }

    const layers = state.layers
    const fromIndex = layers.findIndex(l => l.id === activeId)
    const toIndex   = layers.findIndex(l => l.id === overId)
    if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
      const newLayers = arrayMove(layers, fromIndex, toIndex)
      reorderLayers(
        layers.findIndex(l => l.id === newLayers[0].id),
        0,
      )
      reorderLayers(fromIndex, toIndex)
    }
  }

  function handleSave() {
    if (state.layers.length === 0) {
      setSaveMsg('Add at least one layer first')
      setTimeout(() => setSaveMsg(''), 2000)
      return
    }
    saveDesign()
    setSaveMsg('Design saved ✓')
    setTimeout(() => setSaveMsg(''), 2000)
  }

  function handleAddToCart() {
    if (state.layers.length === 0) return
    addItem({
      id: `custom-${Date.now()}`,
      cakeName: state.cakeName || 'Custom Cake',
      image: '',
      pounds: tierCount || 1,
      pricePKR: estimatedPrice,
    })
    navigate('/order')
  }

  function handleSwitchToColors() {
    setShelfTab('colors')
    if (mobileTab === 'canvas') setMobileTab('shelf')
  }

  const sharedCanvasProps = {
    layers: state.layers,
    selectedLayerId: state.selectedLayerId,
    cakeName: state.cakeName,
    canUndo: state.history.length > 0,
    onSelectLayer: selectLayer,
    onRemoveLayer: removeLayer,
    onNameChange: setCakeName,
    onUndo: undo,
    onClear: clearAll,
    onSave: handleSave,
    onSwitchToColors: handleSwitchToColors,
  }

  const sharedShelfProps = {
    selectedLayerId: state.selectedLayerId,
    layers: state.layers,
    onUpdateColor: updateLayerColor,
    activeTab: shelfTab,
    onTabChange: setShelfTab,
    onAddItem: addLayer,
  }

  const sharedLayerProps = {
    layers: state.layers,
    selectedLayerId: state.selectedLayerId,
    cakeName: state.cakeName,
    tierCount,
    estimatedPrice,
    onSelectLayer: selectLayer,
    onRemoveLayer: removeLayer,
    onToggleVisibility: toggleLayerVisibility,
    onAddToCart: handleAddToCart,
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <SEOHead
        title="Design Your Cake"
        description="Design your own custom cake online. Drag and drop decorations, choose colours and flavours, then order for Karachi delivery."
        url="/builder"
      />
      <Navbar />

      {/* Save toast */}
      <AnimatePresence>
        {saveMsg && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-espresso text-cream text-sm font-body font-medium px-4 py-2 rounded-full shadow-hover"
          >
            {saveMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* ── DESKTOP 3-column ── */}
        <div
          className="hidden md:grid flex-1 overflow-hidden"
          style={{
            gridTemplateColumns: '260px 1fr 240px',
            marginTop: '5rem',
            height: 'calc(100vh - 5rem - 56px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden flex flex-col"
          >
            <DecorationShelf {...sharedShelfProps} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="overflow-hidden flex flex-col"
          >
            <CakeCanvas {...sharedCanvasProps} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="overflow-hidden flex flex-col"
          >
            <LayerPanel {...sharedLayerProps} />
          </motion.div>
        </div>

        {/* ── MOBILE single panel ── */}
        <div
          className="md:hidden flex-1 overflow-hidden flex flex-col"
          style={{ marginTop: '4rem', height: 'calc(100vh - 4rem - 56px)' }}
        >
          {/* Mobile heading strip */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-surface border-b border-primary-light/20 flex-shrink-0">
            <h1 className="font-display text-base font-semibold text-espresso">Cake Builder</h1>
            <span className="font-display text-sm font-bold text-accent whitespace-nowrap">
              PKR {estimatedPrice.toLocaleString()}
            </span>
          </div>

          {mobileTab === 'shelf' && (
            <motion.div key="shelf" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="flex-1 min-h-0 overflow-hidden flex flex-col">
              <DecorationShelf {...sharedShelfProps} />
            </motion.div>
          )}
          {mobileTab === 'canvas' && (
            <motion.div key="canvas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 min-h-0 overflow-hidden flex flex-col">
              <CakeCanvas {...sharedCanvasProps} />
            </motion.div>
          )}
          {mobileTab === 'layers' && (
            <motion.div key="layers" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="flex-1 min-h-0 overflow-hidden flex flex-col">
              <LayerPanel {...sharedLayerProps} />
            </motion.div>
          )}
        </div>

        {/* Drag ghost */}
        <DragOverlay>
          {activeDragItem && (
            <div className="flex items-center gap-2 bg-surface border border-primary/40 rounded-xl px-3 py-2.5 shadow-hover opacity-90 rotate-1 scale-105 cursor-grabbing">
              <span className="text-lg">{activeDragItem.emoji}</span>
              <span className="font-body text-xs font-medium text-espresso">{activeDragItem.name}</span>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <MobileTabBar
        activeTab={mobileTab}
        onTabChange={setMobileTab}
        layerCount={state.layers.length}
      />

      {/* Desktop bottom bar — step indicators + price only */}
      <div className="hidden md:flex items-center justify-between px-6 py-3 bg-surface border-t border-primary-light/20 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {['Choose Base', 'Add Decorations', 'Review & Order'].map((step, i) => {
            const done = i === 0
              ? state.layers.some(l => l.category === 'base')
              : i === 1
              ? state.layers.filter(l => l.category !== 'base').length > 0
              : false
            const active = i === 0
              ? !state.layers.some(l => l.category === 'base')
              : i === 1
              ? state.layers.some(l => l.category === 'base') && state.layers.filter(l => l.category !== 'base').length === 0
              : state.layers.length > 0

            return (
              <div key={step} className="flex items-center gap-2">
                {i > 0 && <div className={`w-8 h-px ${done || active ? 'bg-primary' : 'bg-espresso/10'}`} />}
                <div className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold
                    ${done ? 'bg-primary text-espresso' : active ? 'bg-accent text-white' : 'bg-espresso/10 text-espresso-light/40'}`}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span className={`font-body text-xs font-medium whitespace-nowrap ${active || done ? 'text-espresso' : 'text-espresso-light/40'}`}>
                    {step}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <span className="font-display text-base font-bold text-espresso whitespace-nowrap flex-shrink-0">
          PKR {estimatedPrice.toLocaleString()}
        </span>
      </div>
    </div>
  )
}
