export interface CakeCategory {
  id: string
  name: string
  slug: string
  description: string
  emoji: string
  gradient: string
  coverImage: string
  featured: boolean
}

export const CAKE_CATEGORIES: CakeCategory[] = [
  {
    id: 'birthday',
    name: 'Birthday',
    slug: 'birthday',
    description: 'Celebrate every age with a showstopping birthday cake — from fun cartoon designs to elegant multi-tier creations.',
    emoji: '🎂',
    gradient: 'from-[#FFB347] to-[#FF6B9D]',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    featured: true,
  },
  {
    id: 'wedding',
    name: 'Wedding',
    slug: 'wedding',
    description: 'Timeless, elegant wedding cakes crafted to make your most special day truly unforgettable.',
    emoji: '💍',
    gradient: 'from-[#F8E1E7] to-[#E8C5D0]',
    coverImage: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&q=80',
    featured: true,
  },
  {
    id: 'engagement',
    name: 'Engagement',
    slug: 'engagement',
    description: 'Mark the beginning of forever with a romantic engagement cake that reflects your love story.',
    emoji: '💖',
    gradient: 'from-[#FF9A9E] to-[#FECFEF]',
    coverImage: 'https://images.unsplash.com/photo-1611293388250-580b3c0ef411?w=600&q=80',
    featured: true,
  },
  {
    id: 'baby-shower',
    name: 'Baby Shower',
    slug: 'baby-shower',
    description: 'Welcome the newest member of your family with a sweet, adorable baby shower cake.',
    emoji: '🍼',
    gradient: 'from-[#A8EDEA] to-[#FED6E3]',
    coverImage: 'https://images.unsplash.com/photo-1566438480900-0f2f7c7a0b7f?w=600&q=80',
    featured: false,
  },
  {
    id: 'bridal-shower',
    name: 'Bridal Shower',
    slug: 'bridal-shower',
    description: 'Dreamy, feminine bridal shower cakes perfect for celebrating the bride-to-be.',
    emoji: '👰',
    gradient: 'from-[#FAD0C4] to-[#FFD1FF]',
    coverImage: 'https://images.unsplash.com/photo-1562440499-64b9a2b2c0d5?w=600&q=80',
    featured: false,
  },
  {
    id: 'custom',
    name: 'Custom',
    slug: 'custom',
    description: 'Have a unique vision? Our custom cakes are built entirely around your ideas and theme.',
    emoji: '✨',
    gradient: 'from-[#D4956A] to-[#F2A7BB]',
    coverImage: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600&q=80',
    featured: false,
  },
  {
    id: 'cupcakes',
    name: 'Cupcakes',
    slug: 'cupcakes',
    description: 'Individually crafted cupcakes — perfect for parties, gifting, or treating yourself.',
    emoji: '🧁',
    gradient: 'from-[#FFECD2] to-[#FCB69F]',
    coverImage: 'https://images.unsplash.com/photo-1587241321921-91a834d6d191?w=600&q=80',
    featured: true,
  },
]
