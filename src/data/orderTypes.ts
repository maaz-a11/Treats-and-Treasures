import type { CartItem } from '../context/CartContext'

export type PaymentMethod = 'jazzcash' | 'easypaisa' | 'cash_on_delivery'
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'

export interface DeliveryZone {
  id: string
  name: string
  areas: string[]
  deliveryFeePKR: number
  estimatedHours: string
}

export interface CustomerDetails {
  fullName: string
  phone: string
  email: string
  address: string
  area: string
  zoneId: string
  city: 'Karachi'
  specialNote: string
}

export interface Order {
  id: string
  items: CartItem[]
  customer: CustomerDetails
  paymentMethod: PaymentMethod
  deliveryFeePKR: number
  subtotalPKR: number
  totalPKR: number
  status: OrderStatus
  createdAt: string
  deliveryDate: string
  deliveryTime: string
}
