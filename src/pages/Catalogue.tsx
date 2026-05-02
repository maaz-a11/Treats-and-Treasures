import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEOHead from '../components/SEOHead'
import CakeCard from '../components/catalogue/CakeCard'
import SizeModal from '../components/catalogue/SizeModal'
import { CAKE_CATEGORIES } from '../data/cakeCategories'
import { CAKE_PRODUCTS, type CakeProduct } from '../data/cakeProducts'

export default function Catalogue() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') ?? 'all'

  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<CakeProduct | null>(null)

  function handleCategoryChange(slug: string) {
    setActiveCategory(slug)
    setSearchParams(slug === 'all' ? {} : { category: slug })
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return CAKE_PRODUCTS.filter(p => {
      const matchesCategory = activeCategory === 'all' || p.categoryId === activeCategory
      if (!matchesCategory) return false
      if (!q) return true
      return (
        p.name.toLowerCase().includes(q) ||
        p.flavor.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
      )
    })
  }, [activeCategory, search])

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Browse Our Cakes"
        description="Browse 28+ custom cakes in Karachi — birthday, wedding, engagement and more. Order by weight from PKR 800. Fresh daily delivery."
        url="/catalogue"
      />
      <Navbar />

      {/* Hero strip */}
      <section className="pt-24 md:pt-28 pb-10 bg-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary-light/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-accent-light/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <span className="font-body text-sm font-semibold text-accent tracking-widest uppercase block mb-3">
              Karachi — Made Fresh Daily
            </span>
            <h1 className="font-display text-4xl md:text-5xl text-espresso font-bold mb-3">
              Our <span className="italic text-gradient">Cakes</span>
            </h1>
            <p className="font-body text-base text-espresso-light/70 max-w-lg mx-auto">
              Browse our collection, choose your size in pounds, and place your order.
              All cakes are baked fresh for Karachi delivery.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="max-w-md mx-auto"
          >
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-espresso-light/40 text-base">🔍</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, flavor, or occasion..."
                className="w-full font-body text-sm bg-surface border border-primary/20 rounded-2xl pl-11 pr-4 py-3 text-espresso placeholder-espresso-light/40 outline-none focus:border-primary shadow-card transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-espresso-light/40 hover:text-espresso transition-colors text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category tabs */}
      <div className="sticky top-[64px] md:top-[80px] z-20 bg-background/95 backdrop-blur-md border-b border-primary-light/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-none">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`flex-shrink-0 flex items-center gap-1.5 font-body text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-full transition-all duration-200
                ${activeCategory === 'all'
                  ? 'bg-primary text-espresso shadow-soft'
                  : 'text-espresso-light/60 hover:bg-primary-light/30 hover:text-espresso'}`}
            >
              <span>🎂</span> All Cakes
              <span className="hidden sm:inline font-body text-[10px] bg-espresso/10 px-1.5 py-0.5 rounded-full ml-0.5">
                {CAKE_PRODUCTS.length}
              </span>
            </button>
            {CAKE_CATEGORIES.map(cat => {
              const count = CAKE_PRODUCTS.filter(p => p.categoryId === cat.id).length
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`flex-shrink-0 flex items-center gap-1.5 font-body text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-full transition-all duration-200
                    ${activeCategory === cat.slug
                      ? 'bg-primary text-espresso shadow-soft'
                      : 'text-espresso-light/60 hover:bg-primary-light/30 hover:text-espresso'}`}
                >
                  <span>{cat.emoji}</span>
                  {cat.name}
                  <span className="hidden sm:inline font-body text-[10px] bg-espresso/10 px-1.5 py-0.5 rounded-full ml-0.5">
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 gap-4 text-center"
          >
            <span className="text-5xl">🔍</span>
            <p className="font-display text-xl text-espresso/50">No cakes found</p>
            <p className="font-body text-sm text-espresso-light/40">Try a different search term or category</p>
            <button
              onClick={() => { setSearch(''); handleCategoryChange('all') }}
              className="btn-primary mt-2"
            >
              Show All Cakes
            </button>
          </motion.div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="font-body text-sm text-espresso-light/60">
                {filtered.length} cake{filtered.length !== 1 ? 's' : ''} found
                {activeCategory !== 'all' && ` in ${CAKE_CATEGORIES.find(c => c.slug === activeCategory)?.name}`}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product, i) => (
                <CakeCard
                  key={product.id}
                  product={product}
                  index={i}
                  onOrderClick={setSelectedProduct}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />

      {/* Size Selector Modal */}
      <SizeModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}
