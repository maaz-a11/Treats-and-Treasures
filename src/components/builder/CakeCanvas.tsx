import { useState, useCallback } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { motion, AnimatePresence } from 'framer-motion'
import type { CakeLayer } from '../../hooks/useCakeBuilder'

// ─────────────────────────────────────────────────────────────────────────────
// GEOMETRY CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const CW = 520
const CH = 540
const PLATE_Y  = CH - 36
const PLATE_RX = 148
const PLATE_RY = 14
const RY_RATIO = 0.28

const TIER_DATA = [
  { rx: 132, h: 98 },   // tier 0 = bottom
  { rx:  96, h: 82 },   // tier 1 = middle
  { rx:  64, h: 66 },   // tier 2 = top
]

// Deterministic drip positions — NO Math.random()
const DRIP_POS_TOP    = [-0.80, -0.55, -0.32, -0.10, 0.12, 0.35, 0.58, 0.78]
const DRIP_POS_MID    = [-0.70, -0.35,  0.00,  0.32, 0.62, 0.85]
const DRIP_POS_BOT    = [-0.65, -0.25,  0.15,  0.50, 0.80]
const DRIP_HEIGHTS_TOP = [32, 22, 42, 28, 38, 18, 35, 25]
const DRIP_HEIGHTS_MID = [18, 28, 14, 22, 16, 24]
const DRIP_HEIGHTS_BOT = [12, 20, 16, 14, 18]

// Deterministic stroke offsets for rustic/palette buttercream
const RUSTIC_OFFSETS = [
  { xOff: -8, yFrac: 0.12, len: 0.55 },
  { xOff:  6, yFrac: 0.27, len: 0.65 },
  { xOff: -4, yFrac: 0.41, len: 0.48 },
  { xOff: 10, yFrac: 0.55, len: 0.70 },
  { xOff: -6, yFrac: 0.68, len: 0.52 },
  { xOff:  4, yFrac: 0.82, len: 0.60 },
]
const PALETTE_OFFSETS = [
  { xOff: 0, yFrac: 0.10, len: 0.90 },
  { xOff: 0, yFrac: 0.26, len: 0.85 },
  { xOff: 0, yFrac: 0.42, len: 0.88 },
  { xOff: 0, yFrac: 0.58, len: 0.82 },
  { xOff: 0, yFrac: 0.74, len: 0.87 },
  { xOff: 0, yFrac: 0.88, len: 0.80 },
]

function ryFrom(rx: number) { return Math.round(rx * RY_RATIO) }

function buildTiers(tierCount: number, rotation: number) {
  const baseX = CW / 2 + Math.sin(rotation) * 12
  const result: Array<{ cx: number; bottomY: number; topY: number; rx: number; ryV: number; h: number }> = []
  let curBottomY = PLATE_Y - ryFrom(PLATE_RX) - 4
  for (let i = 0; i < tierCount; i++) {
    const td = TIER_DATA[Math.min(i, TIER_DATA.length - 1)]
    const ryV = ryFrom(td.rx)
    const topY = curBottomY - td.h
    result.push({ cx: baseX, bottomY: curBottomY, topY, rx: td.rx, ryV, h: td.h })
    curBottomY = topY - ryV - 3
  }
  return result
}

// ─────────────────────────────────────────────────────────────────────────────
// COLOUR HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function lighten(hex: string, amt: number): string {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, (n >> 16) + amt))
  const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amt))
  const b = Math.min(255, Math.max(0, (n & 0xff) + amt))
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}
function darken(hex: string, amt: number): string { return lighten(hex, -amt) }

function gid(s: string) { return `cg-${s}` }

// ─────────────────────────────────────────────────────────────────────────────
// CREAM RENDERERS — each visually unique
// ─────────────────────────────────────────────────────────────────────────────
function renderCreamRosettes(cx: number, topY: number, trx: number, ryV: number, color: string, isTopTier: boolean) {
  const elems: JSX.Element[] = []
  const light = lighten(color, 30)
  // Side band on all tiers
  elems.push(
    <path key="band"
      d={`M ${cx-trx} ${topY+16} L ${cx-trx} ${topY} A ${trx} ${ryV} 0 0 1 ${cx+trx} ${topY} L ${cx+trx} ${topY+16} A ${trx} ${ryV} 0 0 0 ${cx-trx} ${topY+16} Z`}
      fill={color} opacity="0.95" />
  )
  if (!isTopTier) return elems
  // Ring of rosettes on top face
  const count = 7
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    const rx2 = cx + trx * 0.62 * Math.cos(angle)
    const ry2 = topY + ryV * 0.55 * Math.sin(angle)
    elems.push(
      <g key={`ros-${i}`}>
        <circle cx={rx2}     cy={ry2}     r={9}   fill={color}  stroke={darken(color,15)} strokeWidth="0.5" />
        <circle cx={rx2-4}   cy={ry2-3}   r={6}   fill={color}  />
        <circle cx={rx2+4}   cy={ry2-3}   r={6}   fill={color}  />
        <circle cx={rx2}     cy={ry2+4}   r={6}   fill={color}  />
        <circle cx={rx2}     cy={ry2-1}   r={3.5} fill={light}  />
      </g>
    )
  }
  // Center rosette
  elems.push(
    <g key="ros-center">
      <circle cx={cx} cy={topY} r={10}  fill={color} stroke={darken(color,15)} strokeWidth="0.5" />
      <circle cx={cx} cy={topY} r={5}   fill={light} />
      <circle cx={cx} cy={topY} r={2.5} fill={lighten(color,50)} />
    </g>
  )
  return elems
}

function renderCreamBorder(cx: number, topY: number, trx: number, ryV: number, color: string, isTopTier: boolean) {
  const elems: JSX.Element[] = []
  // Thin band on sides
  elems.push(
    <path key="band"
      d={`M ${cx-trx} ${topY+12} L ${cx-trx} ${topY} A ${trx} ${ryV} 0 0 1 ${cx+trx} ${topY} L ${cx+trx} ${topY+12} A ${trx} ${ryV} 0 0 0 ${cx-trx} ${topY+12} Z`}
      fill={color} opacity="0.88" />
  )
  if (!isTopTier) return elems
  // Stars/dots all around the top ellipse perimeter
  const perimeter = Math.PI * (3 * (trx + ryV) - Math.sqrt((3*trx+ryV)*(trx+3*ryV)))
  const starCount = Math.floor(perimeter / 14)
  for (let i = 0; i < starCount; i++) {
    const angle = (i / starCount) * Math.PI * 2
    const sx = cx + trx * Math.cos(angle)
    const sy = topY + ryV * Math.sin(angle)
    elems.push(
      <g key={`star-${i}`} transform={`translate(${sx},${sy})`}>
        {[0,1,2,3,4].map(p => {
          const pa = (p / 5) * Math.PI * 2 - Math.PI / 2
          return <circle key={p} cx={Math.cos(pa)*5} cy={Math.sin(pa)*5} r={3} fill={color} />
        })}
        <circle cx={0} cy={0} r={3} fill={lighten(color,25)} />
      </g>
    )
  }
  return elems
}

function renderCreamSwirl(cx: number, topY: number, trx: number, ryV: number, color: string, isTopTier: boolean) {
  const elems: JSX.Element[] = []
  // Side flat band
  elems.push(
    <path key="band"
      d={`M ${cx-trx} ${topY+10} L ${cx-trx} ${topY} A ${trx} ${ryV} 0 0 1 ${cx+trx} ${topY} L ${cx+trx} ${topY+10} A ${trx} ${ryV} 0 0 0 ${cx-trx} ${topY+10} Z`}
      fill={color} opacity="0.9" />
  )
  if (!isTopTier) return elems
  // Large spiral swirl on top face — 3 loops approximated with quadratic curves
  const maxR = trx * 0.75
  let d = `M ${cx} ${topY}`
  const steps = 24
  for (let i = 1; i <= steps; i++) {
    const frac = i / steps
    const angle = frac * Math.PI * 6  // 3 full rotations
    const r = maxR * frac
    const ex = cx + r * Math.cos(angle) * (trx / maxR)
    const ey = topY + r * Math.sin(angle) * (ryV / maxR)
    const cpFrac = (i - 0.5) / steps
    const cpAngle = cpFrac * Math.PI * 6
    const cpR = maxR * cpFrac
    const cpx = cx + cpR * Math.cos(cpAngle) * (trx / maxR)
    const cpy = topY + cpR * Math.sin(cpAngle) * (ryV / maxR)
    d += ` Q ${cpx} ${cpy} ${ex} ${ey}`
  }
  elems.push(<path key="swirl" d={d} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" opacity="0.92" />)
  elems.push(<path key="swirl2" d={d} fill="none" stroke={lighten(color,30)} strokeWidth="3" strokeLinecap="round" opacity="0.7" />)
  // Peak at center
  elems.push(<circle key="peak" cx={cx} cy={topY} r={8} fill={color} />)
  elems.push(<circle key="peakhi" cx={cx} cy={topY} r={4} fill={lighten(color,35)} />)
  return elems
}

function renderCreamFlat(cx: number, topY: number, trx: number, ryV: number, color: string, tierIdx: number) {
  const elems: JSX.Element[] = []
  // Flat full coverage top + smooth band on sides
  elems.push(
    <path key="band"
      d={`M ${cx-trx} ${topY+10} L ${cx-trx} ${topY} A ${trx} ${ryV} 0 0 1 ${cx+trx} ${topY} L ${cx+trx} ${topY+10} A ${trx} ${ryV} 0 0 0 ${cx-trx} ${topY+10} Z`}
      fill={color} opacity="0.95" />
  )
  // Flat top fill with radial gradient
  elems.push(
    <ellipse key="top-flat" cx={cx} cy={topY} rx={trx-2} ry={ryV-1}
      fill={`url(#${gid(`cream-flat-top-${tierIdx}`)})`} />
  )
  return elems
}

// ─────────────────────────────────────────────────────────────────────────────
// FONDANT RENDERERS
// ─────────────────────────────────────────────────────────────────────────────
function renderFondantSmooth(cx: number, topY: number, trx: number, _ryV: number, _color: string) {
  return [
    // Two faint vertical highlight strips
    <rect key="hi-l" x={cx - trx*0.35 - 2} y={topY} width={4} height={100}
      fill="rgba(255,255,255,0.10)" />,
    <rect key="hi-r" x={cx + trx*0.35 - 2} y={topY} width={4} height={100}
      fill="rgba(255,255,255,0.08)" />,
  ]
}

function renderFondantRuffles(cx: number, bottomY: number, trx: number, _ryV: number, color: string, _tierIdx: number) {
  const dark = darken(color, 18)
  const count = 9
  const ruffle: JSX.Element[] = []
  for (let i = 0; i < count; i++) {
    const xPos = cx - trx + (2 * trx * i) / (count - 1)
    ruffle.push(
      <ellipse key={i} cx={xPos} cy={bottomY - 4}
        rx={trx / count * 1.3} ry={14}
        fill={dark} opacity="0.7"
        transform={`rotate(-5,${xPos},${bottomY - 4})`} />
    )
  }
  return ruffle
}

function renderFondantBow(cx: number, topY: number, ryV: number, color: string) {
  const bx = cx, by = topY - ryV - 10
  const bc = lighten(color, 20)
  const bs = darken(color, 15)
  return (
    <g key="bow">
      {/* Left lobe */}
      <ellipse cx={bx-14} cy={by} rx={13} ry={8} fill={bc} stroke={bs} strokeWidth="0.8"
        transform={`rotate(-30,${bx-14},${by})`} />
      {/* Right lobe */}
      <ellipse cx={bx+14} cy={by} rx={13} ry={8} fill={bc} stroke={bs} strokeWidth="0.8"
        transform={`rotate(30,${bx+14},${by})`} />
      {/* Ribbon tails */}
      <path d={`M ${bx-4} ${by+4} Q ${bx-20} ${by+22} ${bx-28} ${by+28}`}
        fill="none" stroke={bc} strokeWidth="4" strokeLinecap="round" />
      <path d={`M ${bx+4} ${by+4} Q ${bx+20} ${by+22} ${bx+28} ${by+28}`}
        fill="none" stroke={bc} strokeWidth="4" strokeLinecap="round" />
      {/* Knot */}
      <circle cx={bx} cy={by} r={7} fill={bs} />
      <circle cx={bx} cy={by} r={4} fill={bc} />
    </g>
  )
}

function renderFondantPearls(cx: number, topY: number, trx: number, ryV: number, h: number) {
  const count = 14
  const bandY = topY + h * 0.45
  const pearls: JSX.Element[] = []
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    const px = cx + (trx - 8) * Math.cos(angle)
    const py = bandY + ryV * 0.35 * Math.sin(angle)
    pearls.push(
      <g key={i}>
        <circle cx={px} cy={py} r={5} fill="#E8E8F0" stroke="#B0B0C8" strokeWidth="0.5" />
        <circle cx={px-2} cy={py-2} r={1.5} fill="rgba(255,255,255,0.8)" />
      </g>
    )
  }
  return pearls
}

function renderFondantFlowers(cx: number, topY: number, trx: number, ryV: number) {
  const positions = [
    { fx: cx + trx * 0.35, fy: topY + ryV * 0.4 },
    { fx: cx - trx * 0.35, fy: topY + ryV * 0.3 },
    { fx: cx,              fy: topY - ryV * 0.2 },
  ]
  const colors = ['#FAD4E0', '#FFB6C1', '#FADADD']
  return positions.map(({ fx, fy }, fi) => (
    <g key={fi}>
      {[0,1,2,3,4].map(pi => {
        const pa = (pi / 5) * Math.PI * 2
        return <ellipse key={pi}
          cx={fx + 8 * Math.cos(pa)} cy={fy + 6 * Math.sin(pa)}
          rx={5} ry={4}
          fill={colors[fi % colors.length]}
          transform={`rotate(${pa * 57.3},${fx + 8*Math.cos(pa)},${fy + 6*Math.sin(pa)})`} />
      })}
      <circle cx={fx} cy={fy} r={4.5} fill="#FFD700" />
      <circle cx={fx} cy={fy} r={2} fill="#FFF176" />
    </g>
  ))
}

// ─────────────────────────────────────────────────────────────────────────────
// BUTTERCREAM RENDERERS
// ─────────────────────────────────────────────────────────────────────────────
function renderBcRustic(cx: number, topY: number, trx: number, h: number, color: string) {
  return RUSTIC_OFFSETS.map((o, i) => {
    const y = topY + h * o.yFrac
    const x1 = cx - trx * o.len * 0.5 + o.xOff
    const x2 = cx + trx * o.len * 0.5 + o.xOff
    const midY = y + (i % 2 === 0 ? 3 : -2)
    return (
      <path key={i}
        d={`M ${x1} ${y} Q ${(x1+x2)/2} ${midY} ${x2} ${y}`}
        fill="none" stroke={lighten(color, 22)} strokeWidth="3.5" strokeLinecap="round" opacity="0.75" />
    )
  })
}

function renderBcPalette(cx: number, topY: number, trx: number, h: number, color: string) {
  const horiz = PALETTE_OFFSETS.map((o, i) => {
    const y = topY + h * o.yFrac
    const x1 = cx - trx * o.len * 0.5
    const x2 = cx + trx * o.len * 0.5
    return (
      <path key={`h${i}`}
        d={`M ${x1} ${y} L ${x2} ${y}`}
        fill="none" stroke={lighten(color, 18)} strokeWidth="2.5" strokeLinecap="round" opacity="0.65" />
    )
  })
  const verts = [-trx * 0.4, 0, trx * 0.4].map((xOff, i) => (
    <path key={`v${i}`}
      d={`M ${cx+xOff} ${topY + h*0.3} L ${cx+xOff+4} ${topY + h*0.5}`}
      fill="none" stroke={lighten(color, 28)} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
  ))
  return [...horiz, ...verts]
}

function renderBcRoses(cx: number, topY: number, trx: number, ryV: number, color: string) {
  const positions = [
    { x: 0, y: 0 }, { x: 0.48, y: -0.22 }, { x: -0.44, y: -0.18 }, { x: 0.22, y: 0.32 },
  ]
  const light = lighten(color, 20)
  const dark  = darken(color, 12)
  return positions.map((pos, ri) => {
    const rx2 = cx + trx * pos.x * 0.58
    const ry2 = topY + ryV * pos.y * 0.75
    return (
      <g key={ri}>
        {/* Outer petals */}
        {[0,1,2,3,4].map(pi => {
          const pa = (pi/5)*Math.PI*2
          return <ellipse key={pi}
            cx={rx2 + 7*Math.cos(pa)} cy={ry2 + 5*Math.sin(pa)}
            rx={6} ry={4.5}
            fill={dark}
            transform={`rotate(${pa*57.3},${rx2+7*Math.cos(pa)},${ry2+5*Math.sin(pa)})`} />
        })}
        <circle cx={rx2} cy={ry2} r={7}   fill={color} />
        <circle cx={rx2} cy={ry2} r={4}   fill={light} />
        <circle cx={rx2} cy={ry2} r={1.5} fill={lighten(color,40)} />
      </g>
    )
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// TOPPER RENDERERS
// ─────────────────────────────────────────────────────────────────────────────
function renderBirthdayCandles(cx: number, topY: number, ryV: number) {
  const candleColors = ['#F2A7BB', '#FFD700', '#87CEEB']
  const spacing = 22
  const startX = cx - spacing
  return candleColors.map((cc, i) => {
    const x = startX + i * spacing
    const baseY = topY - ryV - 2
    return (
      <g key={i}>
        {/* Candle body */}
        <rect x={x-4} y={baseY-24} width={8} height={24} rx={2}
          fill={cc} stroke={darken(cc, 15)} strokeWidth="0.5" />
        {/* Wick */}
        <line x1={x} y1={baseY-24} x2={x} y2={baseY-28} stroke="#555" strokeWidth="1.5" />
        {/* Glow */}
        <ellipse cx={x} cy={baseY-30} rx={7} ry={4} fill="rgba(255,220,100,0.35)" />
        {/* Flame */}
        <path d={`M ${x} ${baseY-38} Q ${x+4} ${baseY-32} ${x} ${baseY-28} Q ${x-4} ${baseY-32} ${x} ${baseY-38}`}
          fill="#FFB347" />
        <path d={`M ${x} ${baseY-36} Q ${x+2} ${baseY-32} ${x} ${baseY-29} Q ${x-2} ${baseY-32} ${x} ${baseY-36}`}
          fill="#FFD700" />
      </g>
    )
  })
}

function renderSparkleCandles(cx: number, topY: number, ryV: number) {
  const spacing = 22
  const startX = cx - spacing
  return [0, 1, 2].map(i => {
    const x = startX + i * spacing
    const baseY = topY - ryV - 2
    return (
      <g key={i}>
        <rect x={x-3} y={baseY-22} width={6} height={22} rx={2}
          fill={['#C0C0C0','#FFD700','#C0C0C0'][i]} />
        {/* Sparkle star */}
        {[0,1,2,3,4,5,6,7].map(si => {
          const sa = (si / 8) * Math.PI * 2
          const sr = si % 2 === 0 ? 9 : 5
          return <line key={si} x1={x + 3*Math.cos(sa)} y1={baseY-26 + 3*Math.sin(sa)}
            x2={x + sr*Math.cos(sa)} y2={baseY-26 + sr*Math.sin(sa)}
            stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
        })}
        <circle cx={x} cy={baseY-26} r={3} fill="#FFD700" />
      </g>
    )
  })
}

function renderWeddingFigures(cx: number, topY: number, ryV: number) {
  const baseY = topY - ryV - 4
  return (
    <g>
      {/* Groom */}
      <circle cx={cx - 10} cy={baseY - 38} r={8} fill="#2C2C2C" />
      <rect x={cx-16} y={baseY-30} width={12} height={20} rx={2} fill="#1A1A2E" />
      <rect x={cx-18} y={baseY-28} width={4}  height={14} rx={1} fill="#1A1A2E" />
      <rect x={cx-6}  y={baseY-28} width={4}  height={14} rx={1} fill="#1A1A2E" />
      <line x1={cx-12} y1={baseY-30} x2={cx-12} y2={baseY-26} stroke="white" strokeWidth="1.5" />
      {/* Bride */}
      <circle cx={cx + 10} cy={baseY-38} r={8} fill="#F5D5C0" />
      {/* Veil */}
      <path d={`M ${cx+2} ${baseY-44} Q ${cx+10} ${baseY-50} ${cx+20} ${baseY-42}`}
        fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
      {/* Dress */}
      <path d={`M ${cx+4} ${baseY-30} L ${cx+2} ${baseY-10} L ${cx+18} ${baseY-10} L ${cx+16} ${baseY-30} Z`}
        fill="white" stroke="#F0E0E0" strokeWidth="0.5" />
      <rect x={cx+4} y={baseY-30} width={12} height={10} rx={2} fill="white" />
      {/* Arms */}
      <line x1={cx+4}  y1={baseY-26} x2={cx} y2={baseY-20} stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <line x1={cx+16} y1={baseY-26} x2={cx+20} y2={baseY-20} stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      {/* Bouquet */}
      <circle cx={cx+3} cy={baseY-18} r={5} fill="#FFB6C1" />
      <circle cx={cx}   cy={baseY-20} r={3} fill="#FF69B4" />
    </g>
  )
}

function renderFloralCrown(cx: number, topY: number, trx: number, ryV: number) {
  const count = 8
  const flowerColors = ['#FFB6C1', '#FFFFFF', '#FFD700', '#98FF98', '#FFB6C1', '#FFFFFF', '#FF69B4', '#FFD700']
  return Array.from({ length: count }).map((_, i) => {
    const angle = (i / count) * Math.PI * 2
    const fx = cx + (trx - 10) * Math.cos(angle)
    const fy = topY + ryV * 0.7 * Math.sin(angle)
    return (
      <g key={i}>
        {[0,1,2,3,4].map(pi => {
          const pa = (pi/5)*Math.PI*2
          return <circle key={pi} cx={fx+4*Math.cos(pa)} cy={fy+4*Math.sin(pa)}
            r={3.5} fill={flowerColors[i]} />
        })}
        <circle cx={fx} cy={fy} r={3} fill="#FFD700" />
      </g>
    )
  })
}

function renderMacarons(cx: number, topY: number, trx: number, ryV: number) {
  const macaronColors = ['#F9C4CE', '#AAD9BB', '#C8A2C8']
  const positions = [
    { x: cx - trx * 0.35, y: topY - ryV * 0.1 },
    { x: cx,               y: topY - ryV * 0.3 },
    { x: cx + trx * 0.35, y: topY - ryV * 0.1 },
  ]
  return positions.map(({ x, y }, mi) => {
    const mc = macaronColors[mi]
    return (
      <g key={mi}>
        {/* Bottom shell */}
        <ellipse cx={x} cy={y+5}  rx={12} ry={7}  fill={mc} stroke={darken(mc,15)} strokeWidth="0.5" />
        {/* Filling */}
        <ellipse cx={x} cy={y+3}  rx={13} ry={3}  fill={lighten(mc,30)} />
        {/* Top shell */}
        <ellipse cx={x} cy={y-3}  rx={12} ry={7}  fill={mc} stroke={darken(mc,15)} strokeWidth="0.5" />
        {/* Feet texture */}
        <ellipse cx={x} cy={y+7}  rx={12} ry={2.5} fill={darken(mc,8)} opacity="0.6" />
        <ellipse cx={x} cy={y-9}  rx={12} ry={2.5} fill={darken(mc,8)} opacity="0.6" />
      </g>
    )
  })
}

function renderGoldLeaf(cx: number, topY: number, trx: number, ryV: number) {
  const leafPositions = [
    { x: cx - trx*0.5, y: topY - ryV*0.2, r: -15 },
    { x: cx + trx*0.3, y: topY - ryV*0.4, r: 20 },
    { x: cx - trx*0.1, y: topY + ryV*0.3, r: -8 },
    { x: cx + trx*0.5, y: topY + ryV*0.1, r: 12 },
  ]
  return leafPositions.map((lp, li) => (
    <g key={li} transform={`translate(${lp.x},${lp.y}) rotate(${lp.r})`}>
      <path d="M 0,-8 Q 12,0 8,12 Q 0,18 -8,12 Q -12,0 0,-8 Z"
        fill="#D4AF37" opacity="0.85" />
      <path d="M 0,-8 Q 4,2 0,12" fill="none" stroke="#FFD700" strokeWidth="0.8" opacity="0.6" />
    </g>
  ))
}

function renderTopperFlag(cx: number, topY: number, ryV: number, emoji: string, idx: number, total: number, surfaceColor: string) {
  const spacing = Math.min(52, (total > 1 ? 200 / (total-1) : 0))
  const startX = cx - ((total-1) * spacing) / 2
  const x = startX + idx * spacing
  const stickBase = topY - ryV - 2
  const cardTop = stickBase - 20 - 30
  const strokeC = darken(surfaceColor, 25)
  return (
    <g key={idx}>
      {/* Stick */}
      <line x1={x} y1={stickBase} x2={x} y2={stickBase-20}
        stroke={strokeC} strokeWidth="2" strokeLinecap="round" />
      {/* Flag card */}
      <rect x={x-20} y={cardTop} width={40} height={28} rx={5}
        fill="rgba(255,255,255,0.92)" stroke={strokeC} strokeWidth="0.8" />
      {/* Emoji */}
      <text x={x} y={cardTop+20} textAnchor="middle" fontSize="16">{emoji}</text>
    </g>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DRIP RENDERER — all tiers
// ─────────────────────────────────────────────────────────────────────────────
function renderDrips(
  cx: number, topY: number, trx: number, ryV: number, h: number,
  tierIdx: number, tierCount: number, drizzleColor: string, gradId2: string,
) {
  const isTop = tierIdx === tierCount - 1
  const posList = isTop ? DRIP_POS_TOP : (tierIdx === tierCount - 2 ? DRIP_POS_MID : DRIP_POS_BOT)
  const hList   = isTop ? DRIP_HEIGHTS_TOP : (tierIdx === tierCount - 2 ? DRIP_HEIGHTS_MID : DRIP_HEIGHTS_BOT)
  const maxH    = isTop ? h * 1.05 : h * 0.5

  const drips = posList.map((frac, di) => {
    const dripX = cx + trx * frac
    const edgeY = topY + ryV * Math.sqrt(Math.max(0, 1 - frac * frac)) * 0.45
    const dripH = Math.min(hList[di % hList.length] ?? 20, maxH)
    const w = isTop ? 5.5 : 4
    return (
      <path key={di}
        d={`M ${dripX-w} ${edgeY}
            Q ${dripX-w-1} ${edgeY+dripH*0.55} ${dripX} ${edgeY+dripH}
            Q ${dripX+w+1} ${edgeY+dripH*0.55} ${dripX+w} ${edgeY}
            Z`}
        fill={`url(#${gradId2})`} />
    )
  })

  // Ganache pool on top face
  const pool = isTop ? (
    <ellipse key="pool"
      cx={cx} cy={topY} rx={trx-6} ry={ryV-2}
      fill={darken(drizzleColor, 10)} opacity="0.65" />
  ) : null

  return [pool, ...drips].filter(Boolean)
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SVG CAKE
// ─────────────────────────────────────────────────────────────────────────────
interface SvgCakeProps {
  layers: CakeLayer[]
  selectedLayerId: string | null
  rotation: number
  onSelectTier: (id: string) => void
  onRemoveLayer: (id: string) => void
}

function SvgCake({ layers, selectedLayerId, rotation, onSelectTier, onRemoveLayer }: SvgCakeProps) {
  const baseLayer     = layers.find(l => l.category === 'base')
  const tierCount     = baseLayer?.tiers ?? 0
  // Live reads — no caching
  const decorLayers   = layers.filter(l => ['cream','fondant','buttercream'].includes(l.category) && l.visible)
  const drizzleLayers = layers.filter(l => l.category === 'drizzle' && l.visible)
  const topperLayers  = layers.filter(l => l.category === 'topper' && l.visible)
  const topDecor      = decorLayers.length > 0 ? decorLayers[decorLayers.length - 1] : null

  if (!baseLayer || tierCount === 0) return null

  const tiers       = buildTiers(tierCount, rotation)
  const spongeColor = baseLayer.color || '#F5DEB3'
  const surfaceColor = topDecor ? topDecor.color : spongeColor
  const drizzleColor = drizzleLayers.length > 0 ? drizzleLayers[drizzleLayers.length - 1].color : null
  const isSelected   = selectedLayerId === baseLayer.id

  const isFondant     = topDecor?.category === 'fondant'
  const isButtercream = topDecor?.category === 'buttercream'
  const isCream       = topDecor?.category === 'cream'
  const topDecorId    = topDecor?.itemId ?? ''

  return (
    <g>
      <defs>
        {/* Tier side gradients */}
        {tiers.map((_t, i) => {
          const sc = surfaceColor
          return (
            <linearGradient key={i} id={gid(`tier${i}`)} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor={lighten(sc, 30)} />
              <stop offset="35%"  stopColor={sc} />
              <stop offset="100%" stopColor={darken(sc, 25)} />
            </linearGradient>
          )
        })}
        {/* Ombre buttercream gradient */}
        {tiers.map((_t, i) => (
          <linearGradient key={i} id={gid(`ombre${i}`)} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={lighten(surfaceColor, 40)} />
            <stop offset="100%" stopColor={darken(surfaceColor, 20)} />
          </linearGradient>
        ))}
        {/* Top face radial gradients */}
        {tiers.map((_t, i) => (
          <radialGradient key={i} id={gid(`top${i}`)} cx="40%" cy="35%" r="65%">
            <stop offset="0%"   stopColor={lighten(surfaceColor, 40)} />
            <stop offset="100%" stopColor={surfaceColor} />
          </radialGradient>
        ))}
        {/* Flat cream top */}
        {tiers.map((_t, i) => (
          <radialGradient key={i} id={gid(`cream-flat-top-${i}`)} cx="35%" cy="35%" r="65%">
            <stop offset="0%"   stopColor={lighten(surfaceColor, 30)} />
            <stop offset="100%" stopColor={surfaceColor} />
          </radialGradient>
        ))}
        {/* Sponge/filling */}
        <linearGradient id={gid('fill')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#e8a878" />
          <stop offset="50%"  stopColor="#fde8c8" />
          <stop offset="100%" stopColor="#e8a878" />
        </linearGradient>
        {/* Drizzle */}
        {drizzleColor && (
          <linearGradient id={gid('drizzle')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={drizzleColor} />
            <stop offset="100%" stopColor={darken(drizzleColor, 18)} />
          </linearGradient>
        )}
        {/* Plate */}
        <linearGradient id={gid('plate')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ffffff" />
          <stop offset="55%"  stopColor="#e8e8e8" />
          <stop offset="100%" stopColor="#c4c4c4" />
        </linearGradient>
        {/* Fondant smooth top */}
        {isFondant && tiers.map((_t, i) => (
          <radialGradient key={i} id={gid(`fondant-top-${i}`)} cx="40%" cy="35%" r="65%">
            <stop offset="0%"   stopColor={lighten(surfaceColor, 22)} />
            <stop offset="100%" stopColor={surfaceColor} />
          </radialGradient>
        ))}
      </defs>

      {/* PLATE */}
      <ellipse cx={CW/2} cy={PLATE_Y+3} rx={PLATE_RX+6} ry={PLATE_RY+3} fill="rgba(0,0,0,0.07)" />
      <ellipse cx={CW/2} cy={PLATE_Y}   rx={PLATE_RX}   ry={PLATE_RY}
        fill={`url(#${gid('plate')})`} stroke="#bbbbbb" strokeWidth="1" />

      {/* TIERS — rendered bottom to top */}
      {tiers.map((t, tierIdx) => {
        const isTopTier = tierIdx === tiers.length - 1
        const { cx, bottomY, topY, rx: trx, ryV, h } = t

        const sideFill = (isButtercream && topDecorId === 'bc-ombre')
          ? `url(#${gid(`ombre${tierIdx}`)})`
          : `url(#${gid(`tier${tierIdx}`)})`

        const sideStroke = isSelected ? '#4F9CF9' : darken(surfaceColor, 18)
        const sideStrokeW = isSelected ? 2.5 : 0.8

        return (
          <g key={tierIdx} onClick={() => onSelectTier(baseLayer.id)} style={{ cursor: 'pointer' }}>

            {/* TIER BODY */}
            <path
              d={`M ${cx-trx} ${topY} L ${cx-trx} ${bottomY}
                  A ${trx} ${ryV} 0 0 0 ${cx+trx} ${bottomY}
                  L ${cx+trx} ${topY}
                  A ${trx} ${ryV} 0 0 1 ${cx-trx} ${topY} Z`}
              fill={sideFill}
              stroke={sideStroke} strokeWidth={sideStrokeW}
            />

            {/* FONDANT: smooth highlights + specific decorations */}
            {isFondant && renderFondantSmooth(cx, topY, trx, ryV, surfaceColor)}
            {isFondant && topDecorId === 'fondant-ruffles' && renderFondantRuffles(cx, bottomY, trx, ryV, surfaceColor, tierIdx)}
            {isFondant && topDecorId === 'fondant-pearls'  && renderFondantPearls(cx, topY, trx, ryV, h)}

            {/* BUTTERCREAM textures */}
            {isButtercream && topDecorId === 'bc-rustic'  && renderBcRustic(cx, topY, trx, h, surfaceColor)}
            {isButtercream && topDecorId === 'bc-palette' && renderBcPalette(cx, topY, trx, h, surfaceColor)}
            {isButtercream && topDecorId === 'bc-smooth'  && (
              <line x1={cx-trx*0.5} y1={topY} x2={cx-trx*0.5} y2={bottomY}
                stroke="rgba(255,255,255,0.18)" strokeWidth="4" />
            )}

            {/* CREAM side bands */}
            {isCream && topDecorId === 'cream-rosettes' && renderCreamRosettes(cx, topY, trx, ryV, surfaceColor, isTopTier)}
            {isCream && topDecorId === 'cream-border'   && renderCreamBorder(cx, topY, trx, ryV, surfaceColor, isTopTier)}
            {isCream && topDecorId === 'cream-swirl'    && renderCreamSwirl(cx, topY, trx, ryV, surfaceColor, isTopTier)}
            {isCream && topDecorId === 'cream-flat'     && renderCreamFlat(cx, topY, trx, ryV, surfaceColor, tierIdx)}

            {/* FILLING STRIP between tiers */}
            {tierIdx > 0 && (
              <path
                d={`M ${cx-trx} ${bottomY} A ${trx} ${ryV} 0 0 0 ${cx+trx} ${bottomY}
                    L ${cx+trx} ${bottomY-7} A ${trx} ${ryV} 0 0 1 ${cx-trx} ${bottomY-7} Z`}
                fill={`url(#${gid('fill')})`} />
            )}

            {/* DRIZZLE on every tier */}
            {drizzleColor && renderDrips(cx, topY, trx, ryV, h, tierIdx, tiers.length, drizzleColor, gid('drizzle'))}

            {/* TOP FACE */}
            <ellipse cx={cx} cy={topY} rx={trx} ry={ryV}
              fill={isFondant ? `url(#${gid(`fondant-top-${tierIdx}`)})` : `url(#${gid(`top${tierIdx}`)})`}
              stroke={sideStroke} strokeWidth={sideStrokeW * 0.7} />

            {/* CREAM top face decorations */}
            {isCream && topDecorId === 'cream-rosettes' && isTopTier && renderCreamRosettes(cx, topY, trx, ryV, surfaceColor, true).slice(1)}
            {isCream && topDecorId === 'cream-border'   && isTopTier && renderCreamBorder(cx, topY, trx, ryV, surfaceColor, true).slice(1)}
            {isCream && topDecorId === 'cream-swirl'    && isTopTier && renderCreamSwirl(cx, topY, trx, ryV, surfaceColor, true)}
            {isCream && topDecorId === 'cream-flat'     && renderCreamFlat(cx, topY, trx, ryV, surfaceColor, tierIdx)}

            {/* FONDANT top + specific decos on top tier */}
            {isFondant && isTopTier && topDecorId === 'fondant-bow'     && renderFondantBow(cx, topY, ryV, surfaceColor)}
            {isFondant && isTopTier && topDecorId === 'fondant-flowers' && renderFondantFlowers(cx, topY, trx, ryV)}

            {/* BUTTERCREAM roses on top tier */}
            {isButtercream && isTopTier && topDecorId === 'bc-roses' && renderBcRoses(cx, topY, trx, ryV, surfaceColor)}

            {/* TOPPERS on top tier */}
            {isTopTier && topperLayers.length > 0 && (() => {
              const topper = topperLayers[0]
              const tid = topper.itemId
              if (tid === 'topper-birthday')  return renderBirthdayCandles(cx, topY, ryV)
              if (tid === 'topper-sparkle')   return renderSparkleCandles(cx, topY, ryV)
              if (tid === 'topper-wedding')   return renderWeddingFigures(cx, topY, ryV)
              if (tid === 'topper-floral')    return renderFloralCrown(cx, topY, trx, ryV)
              if (tid === 'topper-macaron')   return renderMacarons(cx, topY, trx, ryV)
              if (tid === 'topper-gold')      return renderGoldLeaf(cx, topY, trx, ryV)
              // Default: flag cards for all others
              return [renderTopperFlag(cx, topY, ryV, topper.emoji, 0, 1, surfaceColor)]
            })()}

            {/* SELECTION RING */}
            {isSelected && (
              <ellipse cx={cx} cy={topY} rx={trx+4} ry={ryV+4}
                fill="none" stroke="#4F9CF9" strokeWidth="2.5" strokeDasharray="7 3" opacity="0.8" />
            )}
          </g>
        )
      })}

      {/* REMOVE BUTTON */}
      {tiers.length > 0 && (() => {
        const top = tiers[tiers.length - 1]
        return (
          <g style={{ cursor: 'pointer' }}
            onClick={e => { e.stopPropagation(); onRemoveLayer(baseLayer.id) }}>
            <circle cx={top.cx+top.rx+10} cy={top.topY-10} r={11} fill="#ef4444" opacity="0.88" />
            <text x={top.cx+top.rx+10} y={top.topY-6}
              textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">✕</text>
          </g>
        )
      })()}
    </g>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOLBAR
// ─────────────────────────────────────────────────────────────────────────────
interface CanvasToolbarProps {
  cakeName: string; onNameChange: (n: string) => void
  onUndo: () => void; onClear: () => void; onSave: () => void
  canUndo: boolean; rotation: number; onRotate: (v: number) => void
}
function CanvasToolbar({ cakeName, onNameChange, onUndo, onClear, onSave, canUndo, rotation, onRotate }: CanvasToolbarProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-surface border-b border-primary-light/20 flex-shrink-0 flex-wrap">
      <input type="text" value={cakeName} onChange={e => onNameChange(e.target.value)}
        placeholder="Name your cake..."
        className="flex-1 min-w-[120px] font-body text-base bg-background border border-primary/20 rounded-xl px-3 py-1.5 text-espresso placeholder-espresso-light/40 outline-none focus:border-primary transition-colors" />
      {/* Rotation slider — desktop only */}
      <div className="hidden md:flex items-center gap-1.5 bg-background border border-primary/15 rounded-xl px-2 py-1">
        <span className="text-xs">🔄</span>
        <input type="range" min={-1.2} max={1.2} step={0.04} value={rotation}
          onChange={e => onRotate(parseFloat(e.target.value))}
          className="w-20 h-1 accent-primary" title="Rotate view" />
        <span className="font-body text-[10px] text-espresso-light/50 w-6">{Math.round(rotation * 57)}°</span>
      </div>
      <button onClick={onUndo} disabled={!canUndo} title="Undo"
        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-primary-light/30 disabled:opacity-30 text-espresso disabled:cursor-not-allowed">↩</button>
      <button onClick={onClear} title="Clear All"
        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-50 hover:text-red-400 text-espresso-light">🗑</button>
      <button onClick={onSave} title="Save Design"
        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-primary-light/30 text-espresso">💾</button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYER BADGES (no base)
// ─────────────────────────────────────────────────────────────────────────────
function LayerBadges({ layers, selectedLayerId, onSelect, onRemove, onSwitchToColors }:
  { layers: CakeLayer[]; selectedLayerId: string | null; onSelect: (id: string) => void; onRemove: (id: string) => void; onSwitchToColors?: () => void }) {
  return (
    <div className="flex flex-col gap-2 items-center mb-4">
      <AnimatePresence>
        {layers.map(layer => (
          <motion.div key={layer.id}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            onClick={e => { e.stopPropagation(); onSelect(layer.id); onSwitchToColors?.() }}
            className="flex items-center gap-2 bg-surface border rounded-xl px-3 py-2 cursor-pointer group relative"
            style={{ borderColor: selectedLayerId === layer.id ? '#4F9CF9' : undefined }}>
            <span className="text-xl">{layer.emoji}</span>
            <span className="font-body text-xs font-medium text-espresso">{layer.name}</span>
            <div className="w-3.5 h-3.5 rounded-full border border-espresso/15" style={{ backgroundColor: layer.color }} />
            <button onClick={e => { e.stopPropagation(); onRemove(layer.id) }}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-400 text-white rounded-full text-[9px] items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex">✕</button>
          </motion.div>
        ))}
      </AnimatePresence>
      <p className="font-body text-xs text-espresso-light/40 mt-1">Add a Base cake first</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export interface CakeCanvasProps {
  layers: CakeLayer[]; selectedLayerId: string | null; cakeName: string; canUndo: boolean
  onSelectLayer: (id: string | null) => void; onRemoveLayer: (id: string) => void
  onNameChange: (n: string) => void; onUndo: () => void; onClear: () => void; onSave: () => void
  onSwitchToColors?: () => void
}

export default function CakeCanvas({
  layers, selectedLayerId, cakeName, canUndo,
  onSelectLayer, onRemoveLayer, onNameChange, onUndo, onClear, onSave, onSwitchToColors,
}: CakeCanvasProps) {
  const { setNodeRef, isOver } = useDroppable({ id: 'cake-canvas' })
  const [rotation, setRotation] = useState(0)

  const handleSelectTier = useCallback((layerId: string) => {
    onSelectLayer(layerId)
    onSwitchToColors?.()
  }, [onSelectLayer, onSwitchToColors])

  const hasCake = !!layers.find(l => l.category === 'base')

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <CanvasToolbar
        cakeName={cakeName} onNameChange={onNameChange}
        onUndo={onUndo} onClear={onClear} onSave={onSave} canUndo={canUndo}
        rotation={rotation} onRotate={setRotation} />

      <div className="flex-1 flex items-center justify-center overflow-auto p-2 md:p-4">
        <div
          ref={setNodeRef}
          onClick={() => onSelectLayer(null)}
          className="relative rounded-2xl transition-colors duration-200 flex flex-col items-center justify-center w-full md:w-auto"
          style={{
            minHeight: CH + 20,
            background: isOver
              ? 'radial-gradient(ellipse at center, rgba(242,167,187,0.18) 0%, rgba(253,246,240,0.95) 100%)'
              : 'radial-gradient(ellipse at center, rgba(250,240,230,0.7) 0%, rgba(253,246,240,0.4) 100%)',
            border: isOver ? '2px solid #F2A7BB' : '2px dashed rgba(242,167,187,0.28)',
          }}>

          {/* Three.js 3D canvas will replace this 2D preview on Day 3 */}

          {layers.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
              <div className="text-6xl opacity-20">🎂</div>
              <p className="font-display text-xl text-espresso/30">Your cake canvas</p>
              <p className="font-body text-sm text-espresso-light/30 text-center max-w-48">
                Drag a Base from the shelf to begin
              </p>
            </div>
          )}

          {!hasCake && layers.length > 0 && (
            <LayerBadges layers={layers} selectedLayerId={selectedLayerId}
              onSelect={id => { onSelectLayer(id); onSwitchToColors?.() }}
              onRemove={onRemoveLayer} onSwitchToColors={onSwitchToColors} />
          )}

          {hasCake && (
            <AnimatePresence>
              <motion.div key="svg-cake"
                initial={{ opacity: 0, scale: 0.93 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                <svg viewBox={`0 0 ${CW} ${CH}`}
                  style={{ display: 'block', overflow: 'visible', width: '100%', maxWidth: CW, height: 'auto' }}>
                  <SvgCake
                    layers={layers} selectedLayerId={selectedLayerId}
                    rotation={rotation} onSelectTier={handleSelectTier} onRemoveLayer={onRemoveLayer} />
                </svg>
              </motion.div>
            </AnimatePresence>
          )}

          {isOver && (
            <div className="absolute top-3 left-0 right-0 flex justify-center pointer-events-none">
              <span className="font-body text-sm text-primary-dark font-semibold bg-surface/95 px-4 py-1.5 rounded-full border border-primary/30 shadow-soft">
                Drop to add ✓
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
