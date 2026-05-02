// ── OWNER CONFIGURATION ─────────────────────────────────────────────────────
// Update ALL values in this file before going live.
// This is the only file you need to edit for business info.

export const SITE_CONFIG = {
  // WhatsApp: international format WITHOUT + (e.g. '923001234567')
  whatsappNumber:  '923001234567',

  // Business info
  businessName:    'Treats & Treasures',
  businessCity:    'Karachi',
  businessEmail:   'hello@treatsandtreasures.pk',

  // Social links
  instagramHandle: 'treatsandtreasures.pk',
  instagramUrl:    'https://instagram.com/treatsandtreasures.pk',

  // Site URL — update when domain is confirmed
  siteUrl:         'https://treatsandtreasures.pk',

  // Admin PIN — change before going live.
  // Note: Frontend-only guard. Full .NET auth comes in Day 8.
  adminPin:        '1234',
} as const

export type SiteConfig = typeof SITE_CONFIG
