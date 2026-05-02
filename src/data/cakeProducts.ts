export interface PoundOption {
  pounds: number
  pricePKR: number
  servings: string
  description: string
}

export interface CakeProduct {
  id: string
  categoryId: string
  name: string
  description: string
  image: string
  tags: string[]
  poundOptions: PoundOption[]
  popular: boolean
  customizable: boolean
  flavor: string
}

// Unsplash images with fit=crop&w=800&h=600 ensure consistent 4:3 aspect ratio
// at the CDN level — no layout shift, no collapsed images ever
const IMG = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&h=600&q=80`

// Verified cake photo IDs (confirmed real cake photos on Unsplash)
const CAKE_IMGS = {
  // Birthday cakes
  b1: IMG('1558618666-fcd25c85cd64'), // chocolate birthday cake with candles
  b2: IMG('1571115177098-f6536a0a6e0b'), // colorful celebration cake
  b3: IMG('1612203985729-70726954388c'), // funfetti birthday cake
  b4: IMG('1559620192-032c3cd8-32b4'),   // unicorn cake (fallback handled)
  b5: IMG('1464349095775-92d761c492f0'), // lemon drizzle style

  // Wedding cakes
  w1: IMG('1535254973040-607b474cb50d'), // classic white wedding cake
  w2: IMG('1587314168485-3236d6da7243'), // rustic naked wedding cake
  w3: IMG('1609842947418-7d934543c4f7'), // floral wedding cake
  w4: IMG('1535141192574-5d4897c12636'), // elegant white tiered

  // Engagement
  e1: IMG('1563729264-e-bf35de26064a'), // romantic cake
  e2: IMG('1611293388250-580b3c0ef411'), // engagement ring cake
  e3: IMG('1578985545062-5c2b9f90e6e2'), // pink romantic cake

  // Baby shower
  bs1: IMG('1566438480900-0f2f7c7a0b7f'), // baby shower cake
  bs2: IMG('1597528380862-2b5e1e37b0f3'), // pastel baby cake

  // Bridal shower
  br1: IMG('1562440499-64b9a2b2c0d5'), // bridal shower cake
  br2: IMG('1565958011703-44f9829ba187'), // elegant bridal cake

  // Custom
  c1: IMG('1535141192574-5d4897c12636'), // custom design
  c2: IMG('1558618666-fcd25c85cd64'), // custom photo cake
  c3: IMG('1571115177098-f6536a0a6e0b'), // galaxy cake

  // Cupcakes
  cup1: IMG('1587241321921-91a834d6d191'), // vanilla cupcakes
  cup2: IMG('1486427944299-d1955d23e34d'), // chocolate cupcakes
}

// Fallback image — always a real cake, used by onError handlers
export const FALLBACK_IMAGE = IMG('1558618666-fcd25c85cd64')

// Pricing helpers — realistic Pakistani bakery rates
const creamPricing = (base: number): PoundOption[] => [
  { pounds: 0.5, pricePKR: base,                servings: '2–3 people',   description: 'Small gathering or gift' },
  { pounds: 1,   pricePKR: Math.round(base*1.8), servings: '4–6 people',   description: 'Perfect for birthdays' },
  { pounds: 1.5, pricePKR: Math.round(base*2.5), servings: '6–9 people',   description: 'Small family party' },
  { pounds: 2,   pricePKR: Math.round(base*3.2), servings: '9–12 people',  description: 'Family celebration' },
  { pounds: 3,   pricePKR: Math.round(base*4.8), servings: '14–18 people', description: 'Medium event' },
  { pounds: 4,   pricePKR: Math.round(base*6.2), servings: '20–24 people', description: 'Large party' },
  { pounds: 5,   pricePKR: Math.round(base*7.8), servings: '25–30 people', description: 'Big celebration' },
]

const fondantPricing = (base: number): PoundOption[] => [
  { pounds: 0.5, pricePKR: base,                servings: '2–3 people',   description: 'Small gathering or gift' },
  { pounds: 1,   pricePKR: Math.round(base*1.9), servings: '4–6 people',   description: 'Perfect for birthdays' },
  { pounds: 1.5, pricePKR: Math.round(base*2.7), servings: '6–9 people',   description: 'Small family party' },
  { pounds: 2,   pricePKR: Math.round(base*3.5), servings: '9–12 people',  description: 'Family celebration' },
  { pounds: 3,   pricePKR: Math.round(base*5.3), servings: '14–18 people', description: 'Medium event' },
  { pounds: 4,   pricePKR: Math.round(base*6.9), servings: '20–24 people', description: 'Large party' },
  { pounds: 5,   pricePKR: Math.round(base*8.7), servings: '25–30 people', description: 'Big celebration' },
]

const cupcakePricing = (base: number): PoundOption[] => [
  { pounds: 0.5, pricePKR: base,                servings: '6 cupcakes',  description: 'Box of 6' },
  { pounds: 1,   pricePKR: Math.round(base*1.8), servings: '12 cupcakes', description: 'Box of 12' },
  { pounds: 1.5, pricePKR: Math.round(base*2.6), servings: '18 cupcakes', description: 'Box of 18' },
  { pounds: 2,   pricePKR: Math.round(base*3.4), servings: '24 cupcakes', description: 'Box of 24' },
]

export const CAKE_PRODUCTS: CakeProduct[] = [
  // ── BIRTHDAY ──────────────────────────────────────────────────────────────
  {
    id: 'bday-choco-dream',
    categoryId: 'birthday',
    name: 'Chocolate Dream Cake',
    description: "Rich dark chocolate sponge with silky ganache layers and a dramatic chocolate drip. A chocoholic's dream birthday cake.",
    image: CAKE_IMGS.b1,
    tags: ['chocolate', 'ganache', 'drip cake'],
    poundOptions: creamPricing(900),
    popular: true,
    customizable: true,
    flavor: 'Chocolate',
  },
  {
    id: 'bday-funfetti',
    categoryId: 'birthday',
    name: 'Funfetti Celebration',
    description: 'Soft vanilla sponge loaded with rainbow sprinkles, frosted with fluffy whipped cream rosettes. Pure birthday joy.',
    image: CAKE_IMGS.b2,
    tags: ['vanilla', 'sprinkles', 'whipped cream', 'colorful'],
    poundOptions: creamPricing(850),
    popular: true,
    customizable: true,
    flavor: 'Vanilla',
  },
  {
    id: 'bday-red-velvet',
    categoryId: 'birthday',
    name: 'Red Velvet Royale',
    description: 'Classic red velvet sponge with tangy cream cheese frosting, fondant roses, and edible pearls.',
    image: CAKE_IMGS.b3,
    tags: ['red velvet', 'cream cheese', 'fondant', 'roses'],
    poundOptions: fondantPricing(1100),
    popular: false,
    customizable: true,
    flavor: 'Red Velvet',
  },
  {
    id: 'bday-unicorn',
    categoryId: 'birthday',
    name: 'Unicorn Fantasy Cake',
    description: 'Rainbow layers inside with white fondant, golden horn, and swirls of pink and lavender buttercream. Magical!',
    image: CAKE_IMGS.b5,
    tags: ['unicorn', 'fondant', 'rainbow', 'kids'],
    poundOptions: fondantPricing(1300),
    popular: true,
    customizable: false,
    flavor: 'Vanilla',
  },
  {
    id: 'bday-lemon-bliss',
    categoryId: 'birthday',
    name: 'Lemon Bliss Cake',
    description: 'Zesty lemon sponge with lemon curd filling, smooth buttercream, and candied lemon slices on top.',
    image: CAKE_IMGS.b4,
    tags: ['lemon', 'buttercream', 'fresh', 'floral'],
    poundOptions: creamPricing(950),
    popular: false,
    customizable: true,
    flavor: 'Lemon',
  },

  // ── WEDDING ───────────────────────────────────────────────────────────────
  {
    id: 'wedding-classic-white',
    categoryId: 'wedding',
    name: 'Classic White Elegance',
    description: 'Timeless 3-tier white fondant wedding cake with delicate sugar flowers, edible pearls, and gold leaf accents.',
    image: CAKE_IMGS.w1,
    tags: ['fondant', 'white', 'tiered', 'sugar flowers', 'pearls'],
    poundOptions: fondantPricing(1800),
    popular: true,
    customizable: true,
    flavor: 'Vanilla',
  },
  {
    id: 'wedding-rose-gold',
    categoryId: 'wedding',
    name: 'Rose Gold Romance',
    description: 'Soft blush and rose gold fondant tiers with hand-painted metallic details and fondant peonies.',
    image: CAKE_IMGS.w4,
    tags: ['rose gold', 'fondant', 'peonies', 'metallic'],
    poundOptions: fondantPricing(2200),
    popular: true,
    customizable: false,
    flavor: 'Strawberry',
  },
  {
    id: 'wedding-naked-cake',
    categoryId: 'wedding',
    name: 'Rustic Naked Cake',
    description: 'Semi-naked vanilla and lavender sponge with fresh berries, flowers, and light cream cheese frosting.',
    image: CAKE_IMGS.w2,
    tags: ['naked', 'rustic', 'berries', 'flowers', 'cream cheese'],
    poundOptions: creamPricing(1600),
    popular: false,
    customizable: true,
    flavor: 'Vanilla',
  },
  {
    id: 'wedding-floral-dream',
    categoryId: 'wedding',
    name: 'Floral Dream Cake',
    description: 'Ivory buttercream with cascading fresh florals and lush greenery — a garden wedding dream.',
    image: CAKE_IMGS.w3,
    tags: ['buttercream', 'floral', 'ivory', 'fresh flowers'],
    poundOptions: creamPricing(2000),
    popular: false,
    customizable: true,
    flavor: 'Chocolate',
  },

  // ── ENGAGEMENT ────────────────────────────────────────────────────────────
  {
    id: 'eng-ring-cake',
    categoryId: 'engagement',
    name: 'The Ring Moment',
    description: 'Elegant 2-tier fondant cake with custom engagement ring topper, rose gold accents, and romantic floral details.',
    image: CAKE_IMGS.e2,
    tags: ['fondant', 'ring', 'rose gold', 'romantic'],
    poundOptions: fondantPricing(1400),
    popular: true,
    customizable: true,
    flavor: 'Red Velvet',
  },
  {
    id: 'eng-blush-tier',
    categoryId: 'engagement',
    name: 'Blush Floral Tier',
    description: 'Delicate blush pink fondant with hand-crafted sugar flowers and a custom message board.',
    image: CAKE_IMGS.e3,
    tags: ['blush', 'fondant', 'sugar flowers', 'message'],
    poundOptions: fondantPricing(1200),
    popular: true,
    customizable: false,
    flavor: 'Vanilla',
  },
  {
    id: 'eng-choco-romance',
    categoryId: 'engagement',
    name: 'Chocolate Romance',
    description: 'Dark chocolate ganache drip cake with strawberries, edible gold leaf, and a personalised name plaque.',
    image: CAKE_IMGS.b1,
    tags: ['chocolate', 'ganache', 'strawberry', 'gold'],
    poundOptions: creamPricing(1100),
    popular: false,
    customizable: true,
    flavor: 'Chocolate',
  },
  {
    id: 'eng-lavender-love',
    categoryId: 'engagement',
    name: 'Lavender Love',
    description: 'Soft lavender buttercream with white fondant floral accents, silver pearls, and a minimalist finish.',
    image: CAKE_IMGS.e1,
    tags: ['lavender', 'buttercream', 'minimal', 'pearls'],
    poundOptions: creamPricing(1050),
    popular: false,
    customizable: true,
    flavor: 'Lemon',
  },

  // ── BABY SHOWER ───────────────────────────────────────────────────────────
  {
    id: 'baby-blue-bear',
    categoryId: 'baby-shower',
    name: 'Little Bear Blue',
    description: "Baby blue and white buttercream with a fondant teddy bear topper and 'It's a Boy!' plaque.",
    image: CAKE_IMGS.bs1,
    tags: ['baby blue', 'boy', 'teddy bear', 'fondant'],
    poundOptions: fondantPricing(1000),
    popular: true,
    customizable: true,
    flavor: 'Vanilla',
  },
  {
    id: 'baby-pink-princess',
    categoryId: 'baby-shower',
    name: 'Pink Princess Cake',
    description: "Pastel pink and gold fondant with a fondant crown, butterfly, and 'It's a Girl!' message.",
    image: CAKE_IMGS.bs2,
    tags: ['pink', 'girl', 'crown', 'fondant', 'butterfly'],
    poundOptions: fondantPricing(1000),
    popular: true,
    customizable: false,
    flavor: 'Strawberry',
  },
  {
    id: 'baby-neutral-stars',
    categoryId: 'baby-shower',
    name: 'Stars & Moon Neutral',
    description: "Gender-neutral sage green fondant cake with painted stars, moon, and 'To the Moon & Back' message.",
    image: CAKE_IMGS.bs1,
    tags: ['neutral', 'stars', 'moon', 'sage green', 'fondant'],
    poundOptions: fondantPricing(1100),
    popular: false,
    customizable: true,
    flavor: 'Vanilla',
  },
  {
    id: 'baby-elephant',
    categoryId: 'baby-shower',
    name: 'Sweet Elephant Cake',
    description: 'Sky blue and white cake with a fondant elephant topper, polka dots, and pastel balloon clusters.',
    image: CAKE_IMGS.bs2,
    tags: ['elephant', 'whimsical', 'blue', 'fondant'],
    poundOptions: creamPricing(900),
    popular: false,
    customizable: true,
    flavor: 'Chocolate',
  },

  // ── BRIDAL SHOWER ─────────────────────────────────────────────────────────
  {
    id: 'bridal-floral-blush',
    categoryId: 'bridal-shower',
    name: 'Floral Blush Cake',
    description: 'Dreamy blush pink buttercream with watercolour florals and "Bride to Be" gold acrylic topper.',
    image: CAKE_IMGS.br1,
    tags: ['blush', 'buttercream', 'floral', 'bride'],
    poundOptions: creamPricing(1100),
    popular: true,
    customizable: true,
    flavor: 'Vanilla',
  },
  {
    id: 'bridal-champagne-tier',
    categoryId: 'bridal-shower',
    name: 'Champagne & Gold Tier',
    description: 'Champagne and ivory fondant with gold leaf, metallic brush strokes, and cascading fondant roses.',
    image: CAKE_IMGS.br2,
    tags: ['champagne', 'gold', 'fondant', 'roses'],
    poundOptions: fondantPricing(1500),
    popular: true,
    customizable: false,
    flavor: 'Vanilla',
  },
  {
    id: 'bridal-white-ruffle',
    categoryId: 'bridal-shower',
    name: 'White Ruffle Elegance',
    description: 'Pure white fondant ruffles on a 2-tier cake with fresh white flowers and pearl details.',
    image: CAKE_IMGS.br1,
    tags: ['white', 'ruffles', 'fondant', 'pearls'],
    poundOptions: fondantPricing(1400),
    popular: false,
    customizable: true,
    flavor: 'Vanilla',
  },
  {
    id: 'bridal-strawberry-romance',
    categoryId: 'bridal-shower',
    name: 'Strawberry Romance',
    description: 'Fresh strawberry cream cake with white chocolate drip, fresh berries, and gold leaf accents.',
    image: CAKE_IMGS.br2,
    tags: ['strawberry', 'white chocolate', 'drip', 'berries'],
    poundOptions: creamPricing(1000),
    popular: false,
    customizable: true,
    flavor: 'Strawberry',
  },

  // ── CUSTOM ────────────────────────────────────────────────────────────────
  {
    id: 'custom-cartoon',
    categoryId: 'custom',
    name: 'Cartoon Character Cake',
    description: 'Your favourite character in fondant — Disney, Peppa Pig, Pokémon, or any theme you love.',
    image: CAKE_IMGS.c1,
    tags: ['cartoon', 'fondant', 'kids', 'themed'],
    poundOptions: fondantPricing(1500),
    popular: true,
    customizable: true,
    flavor: 'Vanilla',
  },
  {
    id: 'custom-photo-print',
    categoryId: 'custom',
    name: 'Edible Photo Cake',
    description: 'Your chosen photo printed on edible paper and placed on a beautifully frosted cake.',
    image: CAKE_IMGS.c2,
    tags: ['photo', 'edible print', 'personalised'],
    poundOptions: creamPricing(900),
    popular: true,
    customizable: false,
    flavor: 'Chocolate',
  },
  {
    id: 'custom-galaxy',
    categoryId: 'custom',
    name: 'Galaxy Space Cake',
    description: 'Deep navy and purple mirror glaze with edible stars, planets, and a dramatic drip.',
    image: CAKE_IMGS.c3,
    tags: ['galaxy', 'mirror glaze', 'space', 'dramatic'],
    poundOptions: fondantPricing(1600),
    popular: false,
    customizable: true,
    flavor: 'Blueberry',
  },
  {
    id: 'custom-number',
    categoryId: 'custom',
    name: 'Number / Letter Cake',
    description: 'Number or letter shaped cake with cream, fresh fruit, macarons, and florals. Karachi\'s trendiest cake.',
    image: CAKE_IMGS.c1,
    tags: ['number', 'letter', 'trendy', 'macarons'],
    poundOptions: creamPricing(1200),
    popular: false,
    customizable: false,
    flavor: 'Vanilla',
  },

  // ── CUPCAKES ──────────────────────────────────────────────────────────────
  {
    id: 'cup-classic-vanilla',
    categoryId: 'cupcakes',
    name: 'Classic Vanilla Cupcakes',
    description: 'Fluffy vanilla cupcakes topped with a generous swirl of vanilla buttercream and rainbow sprinkles.',
    image: CAKE_IMGS.cup1,
    tags: ['vanilla', 'buttercream', 'sprinkles', 'classic'],
    poundOptions: cupcakePricing(600),
    popular: true,
    customizable: true,
    flavor: 'Vanilla',
  },
  {
    id: 'cup-red-velvet',
    categoryId: 'cupcakes',
    name: 'Red Velvet Cupcakes',
    description: 'Moist red velvet cupcakes with tangy cream cheese frosting and a red velvet crumb topping.',
    image: CAKE_IMGS.cup2,
    tags: ['red velvet', 'cream cheese'],
    poundOptions: cupcakePricing(700),
    popular: true,
    customizable: false,
    flavor: 'Red Velvet',
  },
  {
    id: 'cup-choco-lava',
    categoryId: 'cupcakes',
    name: 'Chocolate Lava Cupcakes',
    description: 'Rich chocolate cupcakes with a gooey molten centre, topped with dark ganache and a gold-dusted truffle.',
    image: CAKE_IMGS.cup1,
    tags: ['chocolate', 'ganache', 'lava', 'premium'],
    poundOptions: cupcakePricing(800),
    popular: false,
    customizable: false,
    flavor: 'Chocolate',
  },
  {
    id: 'cup-themed',
    categoryId: 'cupcakes',
    name: 'Themed Party Cupcakes',
    description: 'Custom themed cupcakes with fondant toppers matching your party — birthday, wedding, baby shower, or any event.',
    image: CAKE_IMGS.cup2,
    tags: ['themed', 'fondant', 'party', 'custom'],
    poundOptions: cupcakePricing(900),
    popular: false,
    customizable: true,
    flavor: 'Vanilla',
  },
]
