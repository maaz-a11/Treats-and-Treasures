import Navbar from '../components/Navbar'
import SEOHead from '../components/SEOHead'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import ThemeShowcase from '../components/ThemeShowcase'
import WhyUs from '../components/WhyUs'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead />
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <ThemeShowcase />
        <WhyUs />
      </main>
      <Footer />
    </div>
  )
}
