import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Themes() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex items-center justify-center min-h-screen">
        <div className="text-center flex flex-col items-center gap-4">
          <span className="text-6xl">🎀</span>
          <h1 className="font-display text-4xl text-espresso">Themes</h1>
          <p className="font-body text-espresso-light">Coming Day 5 — Theme Selector</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
