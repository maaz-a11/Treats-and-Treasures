import { useState, useCallback } from 'react'
import type { Order, OrderStatus } from '../data/orderTypes'

const STORAGE_KEY = 'tnt_orders'

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Order[]) : []
  } catch {
    return []
  }
}

function saveOrders(orders: Order[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(loadOrders)

  const refreshOrders = useCallback(() => {
    setOrders(loadOrders())
  }, [])

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders(prev => {
      const updated = prev.map(o => o.id === id ? { ...o, status } : o)
      saveOrders(updated)
      return updated
    })
  }, [])

  return { orders, updateOrderStatus, refreshOrders }
}
