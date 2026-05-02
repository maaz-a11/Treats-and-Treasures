import { useState, useCallback, useMemo } from 'react'
import type { DecorationItem } from '../components/builder/decorationData'

export interface CakeLayer {
  id: string
  itemId: string
  name: string
  category: DecorationItem['category']
  emoji: string
  color: string
  visible: boolean
  zIndex: number
  tiers?: number
}

interface CakeBuilderState {
  cakeName: string
  layers: CakeLayer[]
  selectedLayerId: string | null
  history: CakeLayer[][]
}

const INITIAL_STATE: CakeBuilderState = {
  cakeName: '',
  layers: [],
  selectedLayerId: null,
  history: [],
}

export function useCakeBuilder() {
  const [state, setState] = useState<CakeBuilderState>(INITIAL_STATE)

  const addLayer = useCallback((item: DecorationItem) => {
    setState(prev => {
      const newLayer: CakeLayer = {
        id: crypto.randomUUID(),
        itemId: item.id,          // always equals item.id
        name: item.name,
        category: item.category,
        emoji: item.emoji,
        color: item.color,
        visible: true,
        zIndex: prev.layers.length,
        tiers: item.tiers,
      }
      // ONE PER CATEGORY — always replace existing of same category
      const filtered = prev.layers.filter(l => l.category !== item.category)
      const newLayers = [...filtered, newLayer]
      return {
        ...prev,
        history: [...prev.history.slice(-20), prev.layers],
        layers: newLayers,
        selectedLayerId: newLayer.id,
      }
    })
  }, [])

  const removeLayer = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      history: [...prev.history.slice(-20), prev.layers],
      layers: prev.layers.filter(l => l.id !== id),
      selectedLayerId: prev.selectedLayerId === id ? null : prev.selectedLayerId,
    }))
  }, [])

  const reorderLayers = useCallback((fromIndex: number, toIndex: number) => {
    setState(prev => {
      const newLayers = [...prev.layers]
      const [moved] = newLayers.splice(fromIndex, 1)
      newLayers.splice(toIndex, 0, moved)
      return {
        ...prev,
        history: [...prev.history.slice(-20), prev.layers],
        layers: newLayers.map((l, i) => ({ ...l, zIndex: i })),
      }
    })
  }, [])

  const selectLayer = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedLayerId: id }))
  }, [])

  const updateLayerColor = useCallback((id: string, color: string) => {
    setState(prev => ({
      ...prev,
      layers: prev.layers.map(l => l.id === id ? { ...l, color } : l),
    }))
  }, [])

  const toggleLayerVisibility = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      layers: prev.layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l),
    }))
  }, [])

  const setCakeName = useCallback((name: string) => {
    setState(prev => ({ ...prev, cakeName: name }))
  }, [])

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.history.length === 0) return prev
      const newHistory = [...prev.history]
      const lastLayers = newHistory.pop()!
      return { ...prev, history: newHistory, layers: lastLayers }
    })
  }, [])

  const clearAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      history: [...prev.history.slice(-20), prev.layers],
      layers: [],
      selectedLayerId: null,
    }))
  }, [])

  const saveDesign = useCallback(() => {
    setState(prev => {
      const design = {
        cakeName: prev.cakeName,
        layers: prev.layers,
        savedAt: new Date().toISOString(),
      }
      localStorage.setItem('tnt_cake_design', JSON.stringify(design))
      return prev
    })
  }, [])

  const estimatedPrice = useMemo(() => {
    const baseLayer = state.layers.find(l => l.category === 'base')
    const tiers = baseLayer?.tiers ?? 0
    const decorationLayers = state.layers.filter(l => l.category !== 'base').length
    return tiers * 1500 + decorationLayers * 200
  }, [state.layers])

  const tierCount = useMemo(() => {
    const baseLayer = state.layers.find(l => l.category === 'base')
    return baseLayer?.tiers ?? 0
  }, [state.layers])

  return {
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
  }
}
