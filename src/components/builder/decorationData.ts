export interface DecorationItem {
  id: string
  category: 'base' | 'cream' | 'fondant' | 'buttercream' | 'drizzle' | 'topper'
  name: string
  emoji: string
  color: string
  tiers?: number
}

export const DECORATION_ITEMS: DecorationItem[] = [
  // ── Base ──
  { id: 'base-round-1', category: 'base', name: 'Round Cake (1 Tier)', emoji: '🎂', color: '#F5DEB3', tiers: 1 },
  { id: 'base-round-2', category: 'base', name: 'Round Cake (2 Tier)', emoji: '🎂', color: '#F5DEB3', tiers: 2 },
  { id: 'base-round-3', category: 'base', name: 'Round Cake (3 Tier)', emoji: '🎂', color: '#F5DEB3', tiers: 3 },
  { id: 'base-square',  category: 'base', name: 'Square Cake',         emoji: '⬛', color: '#F5DEB3', tiers: 1 },
  { id: 'base-heart',   category: 'base', name: 'Heart Cake',          emoji: '🩷', color: '#F2A7BB', tiers: 1 },
  { id: 'base-cupcake', category: 'base', name: 'Cupcake',             emoji: '🧁', color: '#D4956A', tiers: 1 },
  // ── Cream ──
  { id: 'cream-rosettes', category: 'cream', name: 'Whipped Cream Rosettes', emoji: '🌀', color: '#FFFAF7' },
  { id: 'cream-border',   category: 'cream', name: 'Whipped Cream Border',   emoji: '〰️', color: '#FFFAF7' },
  { id: 'cream-swirl',    category: 'cream', name: 'Whipped Cream Swirl',    emoji: '🌪️', color: '#FFFAF7' },
  { id: 'cream-flat',     category: 'cream', name: 'Flat Whipped Cream',     emoji: '⬜', color: '#FFFAF7' },
  // ── Fondant ──
  { id: 'fondant-smooth',  category: 'fondant', name: 'Smooth Fondant Cover', emoji: '🫧', color: '#FAD4E0' },
  { id: 'fondant-ruffles', category: 'fondant', name: 'Fondant Ruffles',      emoji: '🌊', color: '#FAD4E0' },
  { id: 'fondant-bow',     category: 'fondant', name: 'Fondant Bow',          emoji: '🎀', color: '#F2A7BB' },
  { id: 'fondant-flowers', category: 'fondant', name: 'Fondant Flowers',      emoji: '🌸', color: '#FFB6C1' },
  { id: 'fondant-pearls',  category: 'fondant', name: 'Fondant Pearls',       emoji: '🔮', color: '#E8E8F0' },
  // ── Buttercream ──
  { id: 'bc-rustic',  category: 'buttercream', name: 'Rustic Buttercream',    emoji: '🧈', color: '#FFF3C4' },
  { id: 'bc-smooth',  category: 'buttercream', name: 'Smooth Buttercream',    emoji: '✨', color: '#FFF8DC' },
  { id: 'bc-roses',   category: 'buttercream', name: 'Buttercream Roses',     emoji: '🌹', color: '#FFB6C1' },
  { id: 'bc-ombre',   category: 'buttercream', name: 'Ombre Buttercream',     emoji: '🎨', color: '#FAD4E0' },
  { id: 'bc-palette', category: 'buttercream', name: 'Palette Knife Texture', emoji: '🖌️', color: '#FFF8DC' },
  // ── Drizzles ──
  { id: 'drizzle-choc',       category: 'drizzle', name: 'Chocolate Drip',        emoji: '🍫', color: '#5C2E00' },
  { id: 'drizzle-caramel',    category: 'drizzle', name: 'Caramel Drip',          emoji: '🍯', color: '#C8860A' },
  { id: 'drizzle-strawberry', category: 'drizzle', name: 'Strawberry Drip',       emoji: '🍓', color: '#D63B3B' },
  { id: 'drizzle-white-choc', category: 'drizzle', name: 'White Chocolate Drip',  emoji: '🤍', color: '#F5EED5' },
  { id: 'drizzle-mirror',     category: 'drizzle', name: 'Mirror Glaze',          emoji: '🪞', color: '#B8C8E8' },
  // ── Toppers ──
  { id: 'topper-birthday',   category: 'topper', name: 'Happy Birthday Topper', emoji: '🎉', color: '#FFD700' },
  { id: 'topper-wedding',    category: 'topper', name: 'Wedding Topper',        emoji: '💍', color: '#FFFFF0' },
  { id: 'topper-engagement', category: 'topper', name: 'Engagement Ring',       emoji: '💎', color: '#87CEEB' },
  { id: 'topper-baby',       category: 'topper', name: 'Baby Shower Topper',    emoji: '🍼', color: '#89CFF0' },
  { id: 'topper-floral',     category: 'topper', name: 'Floral Crown',          emoji: '👑', color: '#98FF98' },
  { id: 'topper-popsicle',   category: 'topper', name: 'Popsicle Sticks',       emoji: '🍭', color: '#FFB6C1' },
  { id: 'topper-name',       category: 'topper', name: 'Custom Name Topper',    emoji: '✍️', color: '#FFD700' },
  { id: 'topper-number',     category: 'topper', name: 'Number Candles',        emoji: '🕯️', color: '#FFD700' },
  { id: 'topper-sparkle',    category: 'topper', name: 'Sparkle Candles',       emoji: '✨', color: '#C0C0C0' },
  { id: 'topper-macaron',    category: 'topper', name: 'Macarons',              emoji: '🫐', color: '#FFB6C1' },
  { id: 'topper-flowers',    category: 'topper', name: 'Fresh Flowers',         emoji: '🌷', color: '#FF6B6B' },
  { id: 'topper-gold',       category: 'topper', name: 'Edible Gold Leaf',      emoji: '🥇', color: '#FFD700' },
]

// Professional Pakistani/South Asian bakery frosting colors
export const PRESET_COLORS = [
  // Whites & Creams
  { name: 'Pure White',   hex: '#FFFFFF' },
  { name: 'Ivory',        hex: '#F8F4E8' },
  { name: 'Champagne',    hex: '#EDD9A3' },
  { name: 'Cream',        hex: '#FFF5DC' },
  // Pinks — most popular in PK
  { name: 'Blush',        hex: '#F9C4CE' },
  { name: 'Baby Pink',    hex: '#FFB6C1' },
  { name: 'Hot Pink',     hex: '#E75480' },
  { name: 'Rose Gold',    hex: '#C4837A' },
  { name: 'Dusty Rose',   hex: '#C4918B' },
  // Pastels
  { name: 'Lavender',     hex: '#C8A2C8' },
  { name: 'Mint',         hex: '#AAD9BB' },
  { name: 'Sky Blue',     hex: '#87CEEB' },
  { name: 'Peach',        hex: '#FFCBA4' },
  { name: 'Lemon',        hex: '#FFF44F' },
  // Bold / Event
  { name: 'Gold',         hex: '#D4AF37' },
  { name: 'Royal Blue',   hex: '#2E4FAD' },
  { name: 'Emerald',      hex: '#1D6B48' },
  { name: 'Burgundy',     hex: '#7B1E3C' },
  { name: 'Chocolate',    hex: '#4A2312' },
  { name: 'Black',        hex: '#1A1A1A' },
]

// Realistic baked sponge colors (visible cross-section flavors)
export const SPONGE_COLORS = [
  { name: 'Vanilla',      hex: '#F5DEB3' },
  { name: 'Chocolate',    hex: '#5C3317' },
  { name: 'Red Velvet',   hex: '#8B1A1A' },
  { name: 'Lemon',        hex: '#F9E07F' },
  { name: 'Strawberry',   hex: '#E8A0A0' },
  { name: 'Blueberry',    hex: '#7B6DB0' },
  { name: 'Carrot',       hex: '#D4834A' },
  { name: 'Matcha',       hex: '#8FBC8F' },
]

export const TABS = [
  { id: 'base',        label: 'Base',    emoji: '🍰' },
  { id: 'cream',       label: 'Cream',   emoji: '🍦' },
  { id: 'fondant',     label: 'Fondant', emoji: '🎂' },
  { id: 'buttercream', label: 'Butter',  emoji: '🧈' },
  { id: 'drizzle',     label: 'Drizzle', emoji: '🍫' },
  { id: 'topper',      label: 'Toppers', emoji: '🌸' },
  { id: 'colors',      label: 'Colors',  emoji: '🎨' },
] as const
