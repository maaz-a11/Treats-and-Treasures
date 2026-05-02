import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEOHead from '../components/SEOHead'
import StepIndicator from '../components/checkout/StepIndicator'
import { useCart } from '../context/CartContext'
import { DELIVERY_ZONES, TIME_SLOTS } from '../data/deliveryZones'
import type { PaymentMethod, Order } from '../data/orderTypes'
import { FALLBACK_IMAGE } from '../data/cakeProducts'
import { SITE_CONFIG } from '../config/siteConfig'

// WhatsApp number is configured in src/config/siteConfig.ts
const OWNER_WHATSAPP = SITE_CONFIG.whatsappNumber

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function generateOrderId(): string {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const rand = String(Math.floor(Math.random() * 9000) + 1000)
  return `TNT-${date}-${rand}`
}

function getTomorrowDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

function getMaxDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString().slice(0, 10)
}

function formatDateDisplay(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })
}

const PHONE_REGEX = /^03[0-9]{2}-?[0-9]{7}$/

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; icon: string; color: string; desc: string }[] = [
  { id: 'jazzcash',        label: 'JazzCash',         icon: '📱', color: '#FF6600', desc: 'Pay via JazzCash mobile account' },
  { id: 'easypaisa',       label: 'EasyPaisa',        icon: '💚', color: '#3BB143', desc: 'Pay via EasyPaisa mobile account' },
  { id: 'cash_on_delivery',label: 'Cash on Delivery', icon: '💵', color: '#2563EB', desc: 'Pay cash when your order arrives' },
]

// ─────────────────────────────────────────────────────────────────────────────
// SHARED FIELD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface FieldProps {
  label: string; required?: boolean; error?: string; children: React.ReactNode
}
function Field({ label, required, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-xs font-semibold text-[#2C1810] tracking-wide uppercase">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="font-body text-xs text-red-500">{error}</p>}
    </div>
  )
}

const inputCls = `w-full font-body text-sm bg-[#FDF6F0] border rounded-xl px-3 py-2.5 text-[#2C1810]
  placeholder-[#2C1810]/30 outline-none transition-colors
  focus:border-[#F2A7BB] border-[rgba(242,167,187,0.35)]`

const selectCls = `${inputCls} cursor-pointer`

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — CART REVIEW
// ─────────────────────────────────────────────────────────────────────────────
interface Step1Props { onNext: () => void }

function Step1Cart({ onNext }: Step1Props) {
  const { items, updateQty, removeItem, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
        <span className="text-6xl">🛒</span>
        <h2 className="font-display text-2xl text-[#2C1810]">Your cart is empty</h2>
        <p className="font-body text-sm text-[#2C1810]/55 max-w-xs">
          Browse our catalogue and add a cake you love before checking out.
        </p>
        <Link to="/catalogue" className="btn-accent mt-2">Browse Our Cakes</Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex flex-col gap-3">
        {items.map(item => (
          <div key={item.id}
            className="flex items-center gap-3 bg-[#FFFAF7] border border-[#F2A7BB]/20 rounded-2xl p-3 shadow-[0_2px_8px_rgba(44,24,16,0.05)]">
            {/* Image */}
            <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-[#FDF6F0]">
              <img src={item.image} alt={item.cakeName}
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE }} />
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm font-semibold text-[#2C1810] truncate">{item.cakeName}</p>
              <p className="font-body text-xs text-[#2C1810]/50 mt-0.5">{item.pounds} lb</p>
              {item.specialInstructions && (
                <p className="font-body text-[10px] text-[#2C1810]/40 mt-0.5 truncate italic">
                  "{item.specialInstructions}"
                </p>
              )}
            </div>
            {/* Qty controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => updateQty(item.id, item.qty - 1)}
                aria-label={`Decrease quantity of ${item.cakeName}`}
                className="w-7 h-7 rounded-lg border border-[#F2A7BB]/40 flex items-center justify-center
                           text-[#2C1810]/60 hover:bg-[#F2A7BB]/20 hover:text-[#2C1810] transition-colors font-bold text-base">
                −
              </button>
              <span className="font-body text-sm font-semibold text-[#2C1810] w-5 text-center">{item.qty}</span>
              <button onClick={() => updateQty(item.id, item.qty + 1)}
                aria-label={`Increase quantity of ${item.cakeName}`}
                className="w-7 h-7 rounded-lg border border-[#F2A7BB]/40 flex items-center justify-center
                           text-[#2C1810]/60 hover:bg-[#F2A7BB]/20 hover:text-[#2C1810] transition-colors font-bold text-base">
                +
              </button>
            </div>
            {/* Price */}
            <div className="flex-shrink-0 text-right min-w-[80px]">
              <p className="font-display text-sm font-bold text-[#2C1810]">
                PKR {(item.pricePKR * item.qty).toLocaleString()}
              </p>
              {item.qty > 1 && (
                <p className="font-body text-[10px] text-[#2C1810]/40">
                  PKR {item.pricePKR.toLocaleString()} each
                </p>
              )}
            </div>
            {/* Remove */}
            <button onClick={() => removeItem(item.id)}
              aria-label={`Remove ${item.cakeName} from cart`}
              className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center
                         text-[#2C1810]/25 hover:text-red-400 hover:bg-red-50 transition-colors text-sm ml-1">
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Subtotal */}
      <div className="flex justify-between items-center py-4 border-t border-[#F2A7BB]/20">
        <span className="font-body text-sm text-[#2C1810]/60">Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
        <span className="font-display text-xl font-bold text-[#2C1810]">PKR {totalPrice.toLocaleString()}</span>
      </div>
      <p className="font-body text-xs text-[#2C1810]/45 -mt-4">Delivery fee calculated in next step</p>

      <button onClick={onNext}
        className="w-full font-body font-semibold text-base text-white py-4 rounded-2xl transition-all hover:opacity-90 active:scale-[0.99]"
        style={{ backgroundColor: '#D4956A' }}>
        Continue to Delivery →
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — DELIVERY FORM
// ─────────────────────────────────────────────────────────────────────────────
interface DeliveryForm {
  fullName: string; phone: string; email: string
  zoneId: string; area: string; address: string
  deliveryDate: string; deliveryTime: string; specialNote: string
}
type DeliveryErrors = Partial<Record<keyof DeliveryForm, string>>

interface Step2Props {
  form: DeliveryForm
  setForm: React.Dispatch<React.SetStateAction<DeliveryForm>>
  onNext: () => void
  onBack: () => void
}

function Step2Delivery({ form, setForm, onNext, onBack }: Step2Props) {
  const [touched, setTouched] = useState<Partial<Record<keyof DeliveryForm, boolean>>>({})

  const selectedZone = DELIVERY_ZONES.find(z => z.id === form.zoneId)

  function validate(): DeliveryErrors {
    const e: DeliveryErrors = {}
    if (!form.fullName.trim())     e.fullName     = 'Full name is required'
    if (!PHONE_REGEX.test(form.phone)) e.phone    = 'Enter a valid Pakistani number (03XX-XXXXXXX)'
    if (!form.email.includes('@')) e.email         = 'Enter a valid email address'
    if (!form.zoneId)              e.zoneId        = 'Please select a delivery zone'
    if (!form.area)                e.area          = 'Please select your area'
    if (!form.address.trim())      e.address       = 'Please enter your full address'
    if (!form.deliveryDate)        e.deliveryDate  = 'Please select a delivery date'
    if (!form.deliveryTime)        e.deliveryTime  = 'Please select a delivery time'
    return e
  }

  const errors = validate()
  const isValid = Object.keys(errors).length === 0

  function touch(field: keyof DeliveryForm) {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  function update(field: keyof DeliveryForm, value: string) {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      // Reset area when zone changes
      if (field === 'zoneId') next.area = ''
      return next
    })
  }

  function handleContinue() {
    // Touch all fields to show errors
    const allTouched: Partial<Record<keyof DeliveryForm, boolean>> = {}
    ;(Object.keys(form) as (keyof DeliveryForm)[]).forEach(k => { allTouched[k] = true })
    setTouched(allTouched)
    if (isValid) onNext()
  }

  const err = (field: keyof DeliveryForm) =>
    touched[field] ? errors[field] : undefined

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Personal details */}
      <div className="bg-[#FFFAF7] border border-[#F2A7BB]/20 rounded-2xl p-5 flex flex-col gap-4 shadow-[0_2px_8px_rgba(44,24,16,0.05)]">
        <h3 className="font-display text-base font-semibold text-[#2C1810]">Personal Details</h3>
        <Field label="Full Name" required error={err('fullName')}>
          <input className={inputCls} type="text" placeholder="Sara Ahmed"
            value={form.fullName} onChange={e => update('fullName', e.target.value)}
            onBlur={() => touch('fullName')} />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Phone Number" required error={err('phone')}>
            <input className={inputCls} type="tel" placeholder="0312-3456789"
              value={form.phone} onChange={e => update('phone', e.target.value)}
              onBlur={() => touch('phone')} />
          </Field>
          <Field label="Email Address" required error={err('email')}>
            <input className={inputCls} type="email" placeholder="sara@example.com"
              value={form.email} onChange={e => update('email', e.target.value)}
              onBlur={() => touch('email')} />
          </Field>
        </div>
      </div>

      {/* Delivery details */}
      <div className="bg-[#FFFAF7] border border-[#F2A7BB]/20 rounded-2xl p-5 flex flex-col gap-4 shadow-[0_2px_8px_rgba(44,24,16,0.05)]">
        <h3 className="font-display text-base font-semibold text-[#2C1810]">Delivery Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Delivery Zone" required error={err('zoneId')}>
            <select className={selectCls} value={form.zoneId}
              onChange={e => update('zoneId', e.target.value)} onBlur={() => touch('zoneId')}>
              <option value="">Select zone...</option>
              {DELIVERY_ZONES.map(z => (
                <option key={z.id} value={z.id}>
                  {z.name} — PKR {z.deliveryFeePKR} ({z.estimatedHours})
                </option>
              ))}
            </select>
          </Field>
          <Field label="Area" required error={err('area')}>
            <select className={selectCls} value={form.area}
              onChange={e => update('area', e.target.value)} onBlur={() => touch('area')}
              disabled={!form.zoneId}>
              <option value="">Select area...</option>
              {selectedZone?.areas.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Full Address" required error={err('address')}>
          <textarea className={`${inputCls} resize-none`} rows={2}
            placeholder="House/Flat no., Street, Block, Sector..."
            value={form.address} onChange={e => update('address', e.target.value)}
            onBlur={() => touch('address')} />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Delivery Date" required error={err('deliveryDate')}>
            <input className={inputCls} type="date"
              min={getTomorrowDate()} max={getMaxDate()}
              value={form.deliveryDate} onChange={e => update('deliveryDate', e.target.value)}
              onBlur={() => touch('deliveryDate')} />
          </Field>
          <Field label="Delivery Time" required error={err('deliveryTime')}>
            <select className={selectCls} value={form.deliveryTime}
              onChange={e => update('deliveryTime', e.target.value)} onBlur={() => touch('deliveryTime')}>
              <option value="">Select time slot...</option>
              {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Special Note" error={err('specialNote')}>
          <textarea className={`${inputCls} resize-none`} rows={2}
            placeholder="Any allergies, gate code, or access instructions..."
            value={form.specialNote} onChange={e => update('specialNote', e.target.value)} />
        </Field>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack}
          className="flex-shrink-0 font-body font-semibold text-sm text-[#2C1810]/60 px-6 py-3.5 rounded-2xl border-2 border-[rgba(44,24,16,0.15)] hover:border-[rgba(44,24,16,0.3)] transition-colors">
          ← Back
        </button>
        <button onClick={handleContinue}
          className="flex-1 font-body font-semibold text-base text-white py-3.5 rounded-2xl transition-all hover:opacity-90 active:scale-[0.99]"
          style={{ backgroundColor: '#D4956A' }}>
          Continue to Payment →
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — PAYMENT + ORDER SUMMARY
// ─────────────────────────────────────────────────────────────────────────────
interface Step3Props {
  form: DeliveryForm
  onBack: () => void
}

function Step3Payment({ form, onBack }: Step3Props) {
  const { items, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery')
  const [placing, setPlacing] = useState(false)

  const zone = DELIVERY_ZONES.find(z => z.id === form.zoneId)
  const deliveryFee = zone?.deliveryFeePKR ?? 0
  const grandTotal  = totalPrice + deliveryFee

  function handlePlaceOrder() {
    if (placing) return
    setPlacing(true)

    const orderId = generateOrderId()
    const order: Order = {
      id: orderId,
      items,
      customer: {
        fullName:    form.fullName,
        phone:       form.phone,
        email:       form.email,
        address:     form.address,
        area:        form.area,
        zoneId:      form.zoneId,
        city:        'Karachi',
        specialNote: form.specialNote,
      },
      paymentMethod,
      deliveryFeePKR: deliveryFee,
      subtotalPKR:    totalPrice,
      totalPKR:       grandTotal,
      status:         'pending',
      createdAt:      new Date().toISOString(),
      deliveryDate:   form.deliveryDate,
      deliveryTime:   form.deliveryTime,
    }

    // Persist to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('tnt_orders') ?? '[]') as Order[]
      localStorage.setItem('tnt_orders', JSON.stringify([...existing, order]))
    } catch { /* ignore */ }

    // Build WhatsApp message
    const itemLines = items.map(i =>
      `- ${i.cakeName} x${i.qty} — PKR ${(i.pricePKR * i.qty).toLocaleString()}`
    ).join('\n')

    const paymentLabels: Record<PaymentMethod, string> = {
      jazzcash: 'JazzCash', easypaisa: 'EasyPaisa', cash_on_delivery: 'Cash on Delivery',
    }

    const msg = [
      `🎂 *New Order — Treats & Treasures*`,
      `Order ID: ${orderId}`,
      ``,
      `*Items:*`,
      itemLines,
      ``,
      `*Customer:* ${form.fullName}`,
      `*Phone:* ${form.phone}`,
      `*Address:* ${form.address}, ${form.area}`,
      `*Zone:* ${zone?.name ?? ''}`,
      `*Delivery:* ${formatDateDisplay(form.deliveryDate)}, ${form.deliveryTime}`,
      `*Payment:* ${paymentLabels[paymentMethod]}`,
      ``,
      `*Subtotal:* PKR ${totalPrice.toLocaleString()}`,
      `*Delivery:* PKR ${deliveryFee.toLocaleString()}`,
      `*Total:* PKR ${grandTotal.toLocaleString()}`,
      form.specialNote ? `\n*Note:* ${form.specialNote}` : '',
    ].filter(l => l !== undefined).join('\n')

    // Open WhatsApp
    window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank')

    // Clear cart and navigate
    clearCart()
    navigate('/order/confirmation', { state: { orderId, grandTotal, zone: zone?.name, deliveryDate: form.deliveryDate, deliveryTime: form.deliveryTime } })
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-4xl mx-auto">

      {/* ── LEFT: Payment method ── */}
      <div className="flex-1 flex flex-col gap-5">
        <div className="bg-[#FFFAF7] border border-[#F2A7BB]/20 rounded-2xl p-5 shadow-[0_2px_8px_rgba(44,24,16,0.05)]">
          <h3 className="font-display text-base font-semibold text-[#2C1810] mb-4">Payment Method</h3>
          <div className="flex flex-col gap-3">
            {PAYMENT_OPTIONS.map(opt => {
              const isActive = paymentMethod === opt.id
              return (
                <button key={opt.id} onClick={() => setPaymentMethod(opt.id)}
                  className="flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150"
                  style={{
                    borderColor:     isActive ? opt.color : 'rgba(242,167,187,0.3)',
                    backgroundColor: isActive ? `${opt.color}12` : '#FDF6F0',
                  }}>
                  <span className="text-2xl flex-shrink-0">{opt.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-semibold text-[#2C1810]">{opt.label}</p>
                    <p className="font-body text-xs text-[#2C1810]/55 mt-0.5">{opt.desc}</p>
                  </div>
                  <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: isActive ? opt.color : 'rgba(44,24,16,0.2)' }}>
                    {isActive && (
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: opt.color }} />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Info box for digital payments */}
          <AnimatePresence>
            {(paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa') && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="mt-4 flex gap-3 bg-[#FFF3E0] border border-[#FF9800]/30 rounded-xl p-3.5">
                <span className="text-lg flex-shrink-0">📱</span>
                <p className="font-body text-xs text-[#5C3D00] leading-relaxed">
                  After placing your order, you'll receive a WhatsApp message with our{' '}
                  {paymentMethod === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'} number to complete payment.
                  Please send the transaction screenshot back to confirm.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Back + Place Order */}
        <div className="flex flex-col gap-3">
          <button onClick={handlePlaceOrder} disabled={placing}
            className="w-full font-body font-bold text-base text-white py-4 rounded-2xl transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-60"
            style={{ backgroundColor: '#D4956A' }}>
            {placing ? 'Placing Order...' : '🎂 Place Order'}
          </button>
          <button onClick={onBack}
            className="font-body text-sm text-[#2C1810]/50 hover:text-[#2C1810] transition-colors text-center py-1">
            ← Back to Delivery
          </button>
        </div>
      </div>

      {/* ── RIGHT: Order summary ── */}
      <div className="lg:w-[340px] flex-shrink-0 max-w-lg mx-auto w-full lg:mx-0">
        <div className="bg-[#FFFAF7] border border-[#F2A7BB]/20 rounded-2xl p-5 shadow-[0_2px_8px_rgba(44,24,16,0.05)] lg:sticky lg:top-24">
          <h3 className="font-display text-base font-semibold text-[#2C1810] mb-4">Order Summary</h3>

          {/* Items */}
          <div className="flex flex-col gap-2.5 mb-4">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-[#FDF6F0]">
                  <img src={item.image} alt={item.cakeName} className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-xs font-medium text-[#2C1810] truncate">{item.cakeName}</p>
                  <p className="font-body text-[10px] text-[#2C1810]/45">×{item.qty}</p>
                </div>
                <p className="font-body text-xs font-semibold text-[#2C1810] flex-shrink-0">
                  PKR {(item.pricePKR * item.qty).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Price breakdown */}
          <div className="border-t border-[#F2A7BB]/20 pt-3 flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="font-body text-xs text-[#2C1810]/55">Subtotal</span>
              <span className="font-body text-xs font-medium text-[#2C1810]">PKR {totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-body text-xs text-[#2C1810]/55">Delivery ({zone?.name})</span>
              <span className="font-body text-xs font-medium text-[#2C1810]">PKR {deliveryFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#F2A7BB]/20 mt-1">
              <span className="font-body text-sm font-bold text-[#2C1810]">Grand Total</span>
              <span className="font-display text-lg font-bold text-[#2C1810]">PKR {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Delivery info */}
          <div className="mt-4 bg-[#FDF6F0] rounded-xl p-3 flex flex-col gap-1.5">
            <div className="flex items-start gap-2">
              <span className="text-sm flex-shrink-0">📍</span>
              <p className="font-body text-xs text-[#2C1810]/70 leading-snug">
                {form.area}, {zone?.name}<br />
                <span className="text-[#2C1810]/50">{form.address}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">🗓️</span>
              <p className="font-body text-xs text-[#2C1810]/70">
                {formatDateDisplay(form.deliveryDate)}, {form.deliveryTime}
              </p>
            </div>
            {zone && (
              <div className="flex items-center gap-2">
                <span className="text-sm">⏱️</span>
                <p className="font-body text-xs text-[#2C1810]/70">
                  Est. {zone.estimatedHours} after dispatch
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE ANIMATION WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 48 : -48 }),
  center: { opacity: 1, x: 0 },
  exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -48 : 48 }),
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ORDER PAGE
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_FORM: DeliveryForm = {
  fullName: '', phone: '', email: '',
  zoneId: '', area: '', address: '',
  deliveryDate: '', deliveryTime: '', specialNote: '',
}

export default function Order() {
  const [step, setStep]     = useState<1 | 2 | 3>(1)
  const [prevStep, setPrev] = useState<1 | 2 | 3>(1)
  const [form, setForm]     = useState<DeliveryForm>(EMPTY_FORM)

  const direction = step > prevStep ? 1 : -1

  function goTo(s: 1 | 2 | 3) {
    setPrev(step)
    setStep(s)
  }

  return (
    <div className="min-h-screen bg-[#FDF6F0]">
      <SEOHead
        title="Place Your Order"
        description="Complete your cake order. Choose your delivery zone in Karachi, select payment method and confirm your order."
        url="/order"
      />
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#2C1810] mb-2">
            {step === 1 ? 'Your Cart' : step === 2 ? 'Delivery Details' : 'Review & Pay'}
          </h1>
          <p className="font-body text-sm text-[#2C1810]/50">
            {step === 1 ? 'Review your order before checking out'
              : step === 2 ? 'Tell us where to deliver your cake'
              : 'Almost there — choose how you\'d like to pay'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-10">
          <StepIndicator currentStep={step} />
        </div>

        {/* Step content with slide animation */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 1 && <Step1Cart onNext={() => goTo(2)} />}
              {step === 2 && <Step2Delivery form={form} setForm={setForm} onNext={() => goTo(3)} onBack={() => goTo(1)} />}
              {step === 3 && <Step3Payment form={form} onBack={() => goTo(2)} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  )
}

// Export type for use in Step2
interface DeliveryForm {
  fullName: string; phone: string; email: string
  zoneId: string; area: string; address: string
  deliveryDate: string; deliveryTime: string; specialNote: string
}
