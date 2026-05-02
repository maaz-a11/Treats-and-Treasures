import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useOrders } from '../hooks/useOrders'
import type { Order, OrderStatus, PaymentMethod } from '../data/orderTypes'
import { DELIVERY_ZONES } from '../data/deliveryZones'
import { FALLBACK_IMAGE } from '../data/cakeProducts'
import { SITE_CONFIG } from '../config/siteConfig'

// ── Admin PIN — change in src/config/siteConfig.ts ──
const ADMIN_PIN = SITE_CONFIG.adminPin

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS & HELPERS
// ─────────────────────────────────────────────────────────────────────────────
type AdminView = 'overview' | 'all' | 'pending' | 'active' | 'completed'

const STATUS_FLOW: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered']

const STATUS_META: Record<OrderStatus, { label: string; color: string; bg: string; icon: string }> = {
  pending:          { label: 'Pending',          color: '#92400e', bg: '#fef3c7', icon: '⏳' },
  confirmed:        { label: 'Confirmed',         color: '#1e40af', bg: '#dbeafe', icon: '✅' },
  preparing:        { label: 'Preparing',         color: '#854d0e', bg: '#fef9c3', icon: '👨‍🍳' },
  out_for_delivery: { label: 'Out for Delivery',  color: '#6b21a8', bg: '#f3e8ff', icon: '🛵' },
  delivered:        { label: 'Delivered',         color: '#14532d', bg: '#dcfce7', icon: '🎉' },
  cancelled:        { label: 'Cancelled',         color: '#7f1d1d', bg: '#fee2e2', icon: '✕' },
}

const PAYMENT_META: Record<PaymentMethod, { label: string; color: string; bg: string }> = {
  jazzcash:         { label: 'JazzCash',   color: '#c2410c', bg: '#ffedd5' },
  easypaisa:        { label: 'EasyPaisa',  color: '#166534', bg: '#dcfce7' },
  cash_on_delivery: { label: 'COD',        color: '#1e40af', bg: '#dbeafe' },
}

const NAV_ITEMS: { id: AdminView; icon: string; label: string }[] = [
  { id: 'overview',  icon: '📊', label: 'Overview'    },
  { id: 'all',       icon: '📋', label: 'All Orders'  },
  { id: 'pending',   icon: '⏳', label: 'Pending'     },
  { id: 'active',    icon: '🚀', label: 'Active'      },
  { id: 'completed', icon: '✅', label: 'Completed'   },
]

function formatDate(iso: string): string {
  if (!iso) return '—'
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-PK', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  } catch { return iso }
}

function formatPhone(raw: string): string {
  // Convert 0312-3456789 → 923123456789 for WhatsApp
  return '92' + raw.replace(/^0/, '').replace(/-/g, '')
}

function getTodayISO(): string {
  return new Date().toISOString().split('T')[0]
}

function filterByView(orders: Order[], view: AdminView): Order[] {
  switch (view) {
    case 'pending':   return orders.filter(o => o.status === 'pending')
    case 'active':    return orders.filter(o => ['confirmed', 'preparing', 'out_for_delivery'].includes(o.status))
    case 'completed': return orders.filter(o => ['delivered', 'cancelled'].includes(o.status))
    default:          return orders
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────────────────────────────────────
function StatusBadge({ status, size = 'sm' }: { status: OrderStatus; size?: 'sm' | 'lg' }) {
  const m = STATUS_META[status]
  return (
    <span
      className={`inline-flex items-center gap-1 font-body font-semibold rounded-full whitespace-nowrap
        ${size === 'lg' ? 'text-sm px-3 py-1.5' : 'text-[11px] px-2 py-0.5'}`}
      style={{ backgroundColor: m.bg, color: m.color }}
    >
      <span>{m.icon}</span> {m.label}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PIN GATE
// ─────────────────────────────────────────────────────────────────────────────
interface PinGateProps { onAuth: () => void }

function PinGate({ onAuth }: PinGateProps) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  function handleSubmit() {
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem('tnt_admin_auth', '1')
      onAuth()
    } else {
      setError(true)
      setShake(true)
      setPin('')
      setTimeout(() => setShake(false), 600)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF6F0] flex items-center justify-center p-4">
      <motion.div
        animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-[#FFFAF7] rounded-3xl border border-[#F2A7BB]/25 shadow-lg p-8 flex flex-col items-center gap-6"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl">🎂</span>
          <h1 className="font-display text-2xl font-bold text-[#2C1810]">Admin Access</h1>
          <p className="font-body text-sm text-[#2C1810]/50">Treats & Treasures Dashboard</p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={e => { setPin(e.target.value); setError(false) }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Enter PIN"
            className="w-full text-center font-body text-2xl tracking-[0.5em] bg-[#FDF6F0] border-2
                       rounded-2xl px-4 py-3 outline-none transition-colors
                       border-[#F2A7BB]/35 focus:border-[#D4956A]"
            autoFocus
          />
          {error && (
            <p className="font-body text-xs text-red-500 text-center">Incorrect PIN. Try again.</p>
          )}
          <button
            onClick={handleSubmit}
            className="w-full font-body font-semibold text-base text-white py-3 rounded-2xl
                       transition-all hover:opacity-90"
            style={{ backgroundColor: '#D4956A' }}
          >
            Enter Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDER DETAIL DRAWER
// ─────────────────────────────────────────────────────────────────────────────
interface DrawerProps {
  order: Order | null
  onClose: () => void
  onUpdateStatus: (id: string, status: OrderStatus) => void
}

function OrderDrawer({ order, onClose, onUpdateStatus }: DrawerProps) {
  const [confirmCancel, setConfirmCancel] = useState(false)

  if (!order) return null

  const zone = DELIVERY_ZONES.find(z => z.id === order.customer.zoneId)
  const currentIdx = STATUS_FLOW.indexOf(order.status as OrderStatus)
  const waPhone = formatPhone(order.customer.phone)

  function buildWaText(newStatus: OrderStatus) {
    const label = STATUS_META[newStatus]?.label ?? newStatus
    return encodeURIComponent(
      `Hi ${order!.customer.fullName}! 🎂 Your Treats & Treasures order *${order!.id}* is now *${label}*. Thank you for ordering with us!`
    )
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />
      {/* Drawer */}
      <motion.div
        initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className="fixed right-0 top-0 bottom-0 z-50 bg-[#FFFAF7] shadow-2xl
                   w-full md:w-[420px] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F2A7BB]/20 flex-shrink-0">
          <div>
            <p className="font-body text-xs text-[#2C1810]/60 uppercase tracking-widest">Order</p>
            <p className="font-display text-lg font-bold text-[#2C1810]">{order.id}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl
                       hover:bg-[#F2A7BB]/25 text-[#2C1810]/50 hover:text-[#2C1810] transition-colors">
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">

          {/* Current status */}
          <div className="flex items-center justify-between">
            <StatusBadge status={order.status} size="lg" />
            <span className="font-body text-xs text-[#2C1810]/40">
              {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>

          {/* Status update buttons */}
          <div className="bg-[#FDF6F0] rounded-2xl p-4 border border-[#F2A7BB]/18">
            <p className="font-body text-xs font-semibold text-[#2C1810] tracking-widest uppercase mb-3">
              Update Status
            </p>
            <div className="flex flex-wrap gap-2">
              {STATUS_FLOW.map((s, idx) => {
                const isPast    = idx < currentIdx
                const isCurrent = s === order.status
                const isFuture  = idx > currentIdx
                return (
                  <button
                    key={s}
                    disabled={isCurrent || order.status === 'cancelled'}
                    onClick={() => {
                      onUpdateStatus(order.id, s)
                      setConfirmCancel(false)
                    }}
                    className="flex items-center gap-1 font-body text-xs font-semibold px-3 py-1.5
                               rounded-full border-2 transition-all disabled:cursor-default"
                    style={{
                      borderColor: isCurrent ? STATUS_META[s].color
                                 : isPast    ? '#D4956A'
                                 : '#E5E7EB',
                      backgroundColor: isCurrent ? STATUS_META[s].bg
                                     : isPast    ? '#D4956A10'
                                     : 'transparent',
                      color: isCurrent ? STATUS_META[s].color
                           : isPast    ? '#D4956A'
                           : '#9CA3AF',
                      opacity: isFuture && order.status === 'cancelled' ? 0.4 : 1,
                    }}
                  >
                    {isPast && <span className="text-[10px]">✓</span>}
                    {STATUS_META[s].label}
                  </button>
                )
              })}
            </div>

            {/* Cancel */}
            {order.status !== 'cancelled' && order.status !== 'delivered' && (
              <div className="mt-3 pt-3 border-t border-[#F2A7BB]/15">
                {!confirmCancel ? (
                  <button onClick={() => setConfirmCancel(true)}
                    className="font-body text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">
                    Cancel Order
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <p className="font-body text-xs text-red-600 font-semibold">Are you sure?</p>
                    <button onClick={() => { onUpdateStatus(order.id, 'cancelled'); setConfirmCancel(false) }}
                      className="font-body text-xs font-bold text-white bg-red-500 px-3 py-1 rounded-full hover:bg-red-600">
                      Yes, Cancel
                    </button>
                    <button onClick={() => setConfirmCancel(false)}
                      className="font-body text-xs text-[#2C1810]/50 hover:text-[#2C1810]">
                      No
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* WhatsApp customer */}
          <a
            href={`https://wa.me/${waPhone}?text=${buildWaText(order.status)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full font-body font-semibold text-sm
                       text-white py-3 rounded-2xl transition-all hover:opacity-90"
            style={{ backgroundColor: '#25D366' }}
          >
            💬 WhatsApp {order.customer.fullName.split(' ')[0]}
          </a>

          {/* Customer */}
          <Section title="Customer">
            <Row label="Name"    value={order.customer.fullName} />
            <Row label="Phone"   value={
              <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer"
                className="text-[#25D366] hover:underline">{order.customer.phone}</a>
            } />
            <Row label="Email"   value={order.customer.email} />
            <Row label="Address" value={order.customer.address} />
            <Row label="Area"    value={`${order.customer.area}${zone ? `, ${zone.name}` : ''}`} />
            {order.customer.specialNote && (
              <Row label="Note" value={<span className="italic text-[#2C1810]/60">{order.customer.specialNote}</span>} />
            )}
          </Section>

          {/* Items */}
          <Section title="Items Ordered">
            <div className="flex flex-col gap-2.5">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#FDF6F0] flex-shrink-0">
                    <img src={item.image} alt={item.cakeName}
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs font-semibold text-[#2C1810] truncate">{item.cakeName}</p>
                    <p className="font-body text-[11px] text-[#2C1810]/50">{item.pounds} lb × {item.qty}</p>
                  </div>
                  <p className="font-body text-xs font-bold text-[#2C1810] flex-shrink-0">
                    PKR {(item.pricePKR * item.qty).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* Order Summary */}
          <Section title="Order Summary">
            <Row label="Subtotal"     value={`PKR ${order.subtotalPKR.toLocaleString()}`} />
            <Row label="Delivery Fee" value={`PKR ${order.deliveryFeePKR.toLocaleString()}`} />
            <Row label="Payment"      value={PAYMENT_META[order.paymentMethod]?.label ?? order.paymentMethod} />
            <div className="flex justify-between items-center pt-2 border-t border-[#F2A7BB]/15 mt-1">
              <span className="font-body text-sm font-bold text-[#2C1810]">Total</span>
              <span className="font-display text-lg font-bold text-[#2C1810]">
                PKR {order.totalPKR.toLocaleString()}
              </span>
            </div>
          </Section>

          {/* Delivery */}
          <Section title="Delivery Details">
            <Row label="Date"  value={formatDate(order.deliveryDate)} />
            <Row label="Time"  value={order.deliveryTime} />
            {zone && <Row label="ETA" value={zone.estimatedHours} />}
          </Section>
        </div>
      </motion.div>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#FDF6F0] rounded-2xl p-4 border border-[#F2A7BB]/18 flex flex-col gap-2.5">
      <p className="font-body text-[11px] font-semibold text-[#2C1810] tracking-widest uppercase">{title}</p>
      {children}
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start gap-2">
      <span className="font-body text-xs text-[#2C1810]/60 flex-shrink-0">{label}</span>
      <span className="font-body text-xs text-[#2C1810] text-right">{value}</span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// OVERVIEW TAB
// ─────────────────────────────────────────────────────────────────────────────
interface OverviewProps {
  orders: Order[]
  onSelectOrder: (o: Order) => void
  onNavigate: (v: AdminView) => void
}

function Overview({ orders, onSelectOrder, onNavigate }: OverviewProps) {
  const today     = getTodayISO()
  const pending   = orders.filter(o => o.status === 'pending').length
  const todayRev  = orders.filter(o => o.deliveryDate === today).reduce((s, o) => s + o.totalPKR, 0)
  const totalRev  = orders.reduce((s, o) => s + o.totalPKR, 0)
  const recent    = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5)

  const statCards = [
    { label: 'Total Orders',   value: orders.length,         icon: '📋', bg: '#dbeafe', color: '#1e40af' },
    { label: 'Pending',        value: pending,               icon: '⏳', bg: '#fef3c7', color: '#92400e' },
    { label: "Today's Revenue",value: `PKR ${todayRev.toLocaleString()}`, icon: '💰', bg: '#dcfce7', color: '#14532d' },
    { label: 'Total Revenue',  value: `PKR ${totalRev.toLocaleString()}`, icon: '📈', bg: '#f3e8ff', color: '#6b21a8' },
  ]

  // Status distribution chart data
  const statusCounts = Object.keys(STATUS_META).reduce((acc, s) => {
    acc[s as OrderStatus] = orders.filter(o => o.status === s).length
    return acc
  }, {} as Record<OrderStatus, number>)

  const chartBars = Object.entries(statusCounts).filter(([, c]) => c > 0)
  const chartColors: Record<OrderStatus, string> = {
    pending: '#f59e0b', confirmed: '#3b82f6', preparing: '#eab308',
    out_for_delivery: '#a855f7', delivered: '#22c55e', cancelled: '#ef4444',
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4">
        {statCards.map(c => (
          <div key={c.label}
            className="bg-[#FFFAF7] rounded-2xl border border-[#F2A7BB]/20 p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-body text-xs text-[#2C1810]/50 mb-1">{c.label}</p>
                <p className="font-display text-xl md:text-2xl font-bold truncate" style={{ color: c.color }}>{c.value}</p>
              </div>
              <div className="text-2xl w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: c.bg }}>
                {c.icon}
              </div>
            </div>
            <p className="font-body text-[10px] text-[#2C1810]/35 mt-2">This month</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-[#FFFAF7] rounded-2xl border border-[#F2A7BB]/20 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="font-body text-sm font-semibold text-[#2C1810]">Recent Orders</p>
            <button onClick={() => onNavigate('all')}
              className="font-body text-xs text-[#D4956A] hover:underline">View all →</button>
          </div>
          {recent.length === 0 ? (
            <p className="font-body text-xs text-[#2C1810]/40 text-center py-6">No orders yet</p>
          ) : (
            <div className="flex flex-col gap-2">
              {recent.map(o => (
                <button key={o.id} onClick={() => onSelectOrder(o)}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl
                             hover:bg-[#FDF6F0] transition-colors text-left w-full group">
                  <div className="min-w-0">
                    <p className="font-body text-xs font-semibold text-[#2C1810] font-mono truncate">{o.id}</p>
                    <p className="font-body text-[11px] text-[#2C1810]/50 truncate">{o.customer.fullName}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={o.status} />
                    <span className="font-body text-xs font-bold text-[#2C1810]">
                      PKR {o.totalPKR.toLocaleString()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status chart */}
        <div className="bg-[#FFFAF7] rounded-2xl border border-[#F2A7BB]/20 p-4 shadow-sm">
          <p className="font-body text-sm font-semibold text-[#2C1810] mb-4">Orders by Status</p>
          {chartBars.length === 0 ? (
            <p className="font-body text-xs text-[#2C1810]/40 text-center py-6">No orders yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {chartBars.map(([status, count]) => {
                const s = status as OrderStatus
                const pct = orders.length > 0 ? (count / orders.length) * 100 : 0
                return (
                  <div key={s}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-body text-xs text-[#2C1810]/70">{STATUS_META[s].label}</span>
                      <span className="font-body text-xs font-semibold text-[#2C1810]">{count}</span>
                    </div>
                    <div className="h-2.5 bg-[#FDF6F0] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: chartColors[s] }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDERS TABLE
// ─────────────────────────────────────────────────────────────────────────────
interface TableProps {
  orders: Order[]
  onSelectOrder: (o: Order) => void
  view: AdminView
}

function OrdersTable({ orders, onSelectOrder, view }: TableProps) {
  const [search, setSearch]     = useState('')
  const [sortKey, setSortKey]   = useState<'date' | 'total'>('date')
  const [sortDir, setSortDir]   = useState<'desc' | 'asc'>('desc')
  const [copied, setCopied]     = useState<string | null>(null)

  const filtered = filterByView(orders, view)
    .filter(o => {
      const q = search.toLowerCase()
      if (!q) return true
      return o.id.toLowerCase().includes(q) ||
             o.customer.fullName.toLowerCase().includes(q) ||
             o.customer.phone.includes(q)
    })
    .sort((a, b) => {
      const mul = sortDir === 'desc' ? -1 : 1
      if (sortKey === 'date') return mul * a.deliveryDate.localeCompare(b.deliveryDate)
      return mul * (a.totalPKR - b.totalPKR)
    })

  function toggleSort(key: 'date' | 'total') {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortKey(key); setSortDir('desc') }
  }

  function copyId(id: string) {
    navigator.clipboard.writeText(id).then(() => {
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  const viewLabel = NAV_ITEMS.find(n => n.id === view)?.label ?? 'Orders'

  return (
    <div className="flex flex-col gap-4">
      {/* Search + sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2C1810]/30 text-sm">🔍</span>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID, name, or phone..."
            className="w-full font-body text-base bg-[#FFFAF7] border border-[#F2A7BB]/25 rounded-xl
                       pl-9 pr-3 py-2.5 text-[#2C1810] placeholder-[#2C1810]/30
                       outline-none focus:border-[#F2A7BB] transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => toggleSort('date')}
            className={`font-body text-xs font-semibold px-3 py-2 rounded-xl border transition-colors
              ${sortKey === 'date' ? 'border-[#D4956A] bg-[#D4956A]/10 text-[#D4956A]' : 'border-[#F2A7BB]/25 text-[#2C1810]/50 hover:border-[#D4956A]/40'}`}>
            Date {sortKey === 'date' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
          </button>
          <button onClick={() => toggleSort('total')}
            className={`font-body text-xs font-semibold px-3 py-2 rounded-xl border transition-colors
              ${sortKey === 'total' ? 'border-[#D4956A] bg-[#D4956A]/10 text-[#D4956A]' : 'border-[#F2A7BB]/25 text-[#2C1810]/50 hover:border-[#D4956A]/40'}`}>
            Total {sortKey === 'total' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
          </button>
        </div>
      </div>

      {/* Count */}
      <p className="font-body text-xs text-[#2C1810]/45">
        {filtered.length} {filtered.length === 1 ? 'order' : 'orders'} in {viewLabel}
      </p>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="bg-[#FFFAF7] rounded-2xl border border-[#F2A7BB]/20 p-12 text-center">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-display text-lg text-[#2C1810]/50">No orders found</p>
          <p className="font-body text-sm text-[#2C1810]/35 mt-1">
            {search ? 'Try a different search term' : `No ${viewLabel.toLowerCase()} right now`}
          </p>
        </div>
      ) : (
        /* Table — scrollable on mobile */
        <div className="bg-[#FFFAF7] rounded-2xl border border-[#F2A7BB]/20 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-[#F2A7BB]/15">
                  {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Delivery Date', 'Status', ''].map(h => (
                    <th key={h} className="font-body text-[11px] font-semibold text-[#2C1810]/45
                                           tracking-widest uppercase text-left px-4 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.id}
                    className="border-b border-[#F2A7BB]/10 hover:bg-[#FDF6F0] transition-colors">
                    {/* Order ID */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs text-[#2C1810] font-semibold">{order.id}</span>
                        <div className="relative">
                          <button onClick={() => copyId(order.id)}
                            aria-label={`Copy order ID ${order.id}`}
                            className="text-[#2C1810]/30 hover:text-[#D4956A] transition-colors text-sm">
                            📋
                          </button>
                          {copied === order.id && (
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#2C1810] text-white
                                             text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">
                              Copied!
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* Customer */}
                    <td className="px-4 py-3">
                      <p className="font-body text-xs font-semibold text-[#2C1810]">{order.customer.fullName}</p>
                      <p className="font-body text-[11px] text-[#2C1810]/65">{order.customer.phone}</p>
                    </td>
                    {/* Items */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 2).map((item, i) => (
                            <div key={i} className="w-7 h-7 rounded-lg overflow-hidden border-2 border-white bg-[#FDF6F0]">
                              <img src={item.image} alt="" className="w-full h-full object-cover"
                                onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE }} />
                            </div>
                          ))}
                        </div>
                        <span className="font-body text-xs text-[#2C1810]/60">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          {order.items.length > 2 && ` (+${order.items.length - 2})`}
                        </span>
                      </div>
                    </td>
                    {/* Total */}
                    <td className="px-4 py-3">
                      <span className="font-body text-sm font-bold text-[#2C1810]">
                        PKR {order.totalPKR.toLocaleString()}
                      </span>
                    </td>
                    {/* Payment */}
                    <td className="px-4 py-3">
                      <span className="font-body text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: PAYMENT_META[order.paymentMethod]?.bg, color: PAYMENT_META[order.paymentMethod]?.color }}>
                        {PAYMENT_META[order.paymentMethod]?.label}
                      </span>
                    </td>
                    {/* Date */}
                    <td className="px-4 py-3">
                      <p className="font-body text-xs text-[#2C1810]">{formatDate(order.deliveryDate)}</p>
                      <p className="font-body text-[11px] text-[#2C1810]/65">{order.deliveryTime}</p>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    {/* Action */}
                    <td className="px-4 py-3">
                      <button onClick={() => onSelectOrder(order)}
                        className="font-body text-xs font-semibold text-[#D4956A] border border-[#D4956A]/30
                                   hover:bg-[#D4956A]/10 px-3 py-1.5 rounded-xl transition-colors">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { orders, updateOrderStatus } = useOrders()
  const [activeView, setActiveView] = useState<AdminView>('overview')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  function handleUpdateStatus(id: string, status: OrderStatus) {
    updateOrderStatus(id, status)
    // Keep drawer open but update selected order
    setSelectedOrder(prev => prev && prev.id === id ? { ...prev, status } : prev)
  }

  const pendingCount = orders.filter(o => o.status === 'pending').length

  return (
    <div className="flex h-screen bg-[#FDF6F0] overflow-hidden">

      {/* ── SIDEBAR (desktop) ── */}
      <aside className="hidden md:flex flex-col w-[240px] flex-shrink-0 bg-[#FFFAF7]
                        border-r border-[#F2A7BB]/20 h-screen sticky top-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[#F2A7BB]/15">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎂</span>
            <div>
              <p className="font-display text-sm font-bold text-[#2C1810]">Treats & Treasures</p>
              <p className="font-body text-[10px] text-[#2C1810]/45 uppercase tracking-widest">Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map(item => {
            const isActive = activeView === item.id
            return (
              <button key={item.id} onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all
                  font-body text-sm font-medium w-full relative
                  ${isActive
                    ? 'bg-[#FAD4E0]/40 text-[#2C1810] border-l-2 border-[#D4956A] pl-[10px]'
                    : 'text-[#2C1810]/55 hover:bg-[#FDF6F0] hover:text-[#2C1810]'}`}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.id === 'pending' && pendingCount > 0 && (
                  <span className="ml-auto font-body text-[10px] font-bold bg-amber-400 text-white
                                   w-5 h-5 rounded-full flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom links */}
        <div className="px-3 py-4 border-t border-[#F2A7BB]/15 flex flex-col gap-1">
          <Link to="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm
                       text-[#2C1810]/50 hover:bg-[#FDF6F0] hover:text-[#2C1810] transition-colors">
            <span>🔗</span> View Website
          </Link>
          <button onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm
                       text-red-500/70 hover:bg-red-50 hover:text-red-600 transition-colors text-left w-full">
            <span>🚪</span> Log Out
          </button>
        </div>
      </aside>

      {/* ── MOBILE TAB BAR ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-[#FFFAF7] border-b border-[#F2A7BB]/20
                      flex items-center justify-around px-2 py-2 pt-safe">
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl relative
              ${activeView === item.id ? 'text-[#D4956A]' : 'text-[#2C1810]/40'}`}>
            <span className="text-lg">{item.icon}</span>
            {item.id === 'pending' && pendingCount > 0 && (
              <span className="absolute top-0 right-1 w-4 h-4 bg-amber-400 text-white text-[9px]
                               font-bold rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
        <button onClick={onLogout} className="text-red-400 px-2 py-1.5">
          <span className="text-lg">🚪</span>
        </button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-y-auto md:p-7 p-4 mt-16 md:mt-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#2C1810]">
              {NAV_ITEMS.find(n => n.id === activeView)?.label}
            </h1>
            <p className="font-body text-sm text-[#2C1810]/45 mt-0.5">
              {new Date().toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button onClick={onLogout}
            className="hidden md:flex font-body text-xs text-[#2C1810]/40 hover:text-red-500
                       items-center gap-1.5 transition-colors">
            <span>🚪</span> Log Out
          </button>
        </div>

        {/* View content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}>
            {activeView === 'overview' ? (
              <Overview
                orders={orders}
                onSelectOrder={setSelectedOrder}
                onNavigate={setActiveView} />
            ) : (
              <OrdersTable
                orders={orders}
                onSelectOrder={setSelectedOrder}
                view={activeView} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── ORDER DRAWER ── */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDrawer
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onUpdateStatus={handleUpdateStatus} />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem('tnt_admin_auth') === '1'
  )

  function handleAuth() { setAuthed(true) }

  function handleLogout() {
    sessionStorage.removeItem('tnt_admin_auth')
    setAuthed(false)
  }

  return authed
    ? <Dashboard onLogout={handleLogout} />
    : <PinGate onAuth={handleAuth} />
}
