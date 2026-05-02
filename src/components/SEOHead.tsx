import { useEffect } from 'react'
import { SITE_CONFIG } from '../config/siteConfig'

interface SEOHeadProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

const SITE_NAME = SITE_CONFIG.businessName
const DEFAULT_DESC = "Karachi's most personal cake studio. Order custom cakes, cupcakes and desserts online. Fresh daily delivery across Karachi."
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&h=630&q=80'

export default function SEOHead({ title, description, image, url }: SEOHeadProps) {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} | Custom Cakes & Cupcakes Karachi`
  const desc    = description ?? DEFAULT_DESC
  const img     = image       ?? DEFAULT_IMAGE
  const pageUrl = url
    ? `${SITE_CONFIG.siteUrl}${url}`
    : SITE_CONFIG.siteUrl

  useEffect(() => {
    document.title = fullTitle

    function setMeta(key: string, content: string, attr = 'name') {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    // Standard
    setMeta('description', desc)
    setMeta('keywords', 'custom cakes karachi, birthday cakes karachi, wedding cakes pakistan, order cake online karachi, cupcakes karachi, fondant cakes, cake delivery karachi, treats and treasures')
    setMeta('author',    SITE_NAME)
    setMeta('robots',    'index, follow')
    setMeta('theme-color', '#F2A7BB')

    // Open Graph
    setMeta('og:title',       fullTitle, 'property')
    setMeta('og:description', desc,      'property')
    setMeta('og:image',       img,       'property')
    setMeta('og:url',         pageUrl,   'property')
    setMeta('og:type',        'website', 'property')
    setMeta('og:site_name',   SITE_NAME, 'property')
    setMeta('og:locale',      'en_PK',   'property')

    // Twitter Card
    setMeta('twitter:card',        'summary_large_image')
    setMeta('twitter:title',       fullTitle)
    setMeta('twitter:description', desc)
    setMeta('twitter:image',       img)
  }, [fullTitle, desc, img, pageUrl])

  return null
}
