'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/cartStore'
import { clearCatalogReturnQuery, consumeCatalogNavigationPending, hasCatalogReturnQuery, readCatalogNavigationSnapshot } from '@/lib/catalogNavigationState'

import Topbar           from '@/components/layout/Topbar'
import Navbar           from '@/components/layout/Navbar'
import Footer           from '@/components/layout/Footer'
import HeroSection      from '@/components/hero/HeroSection'
import LetterSection    from '@/components/sections/LetterSection'
import CategoryGrid     from '@/components/catalog/CategoryGrid'
import HowItWorks       from '@/components/sections/HowItWorks'
import CommunitySection from '@/components/sections/CommunitySection'
import WaitlistSection  from '@/components/sections/WaitlistSection'
import ResultsGrid      from '@/components/results/ResultsGrid'
import CartPage         from '@/components/cart/CartPage'
import GaragePage       from '@/components/garage/GaragePage'
import RacersEdgeHome   from '@/components/racers-edge/RacersEdgeHome'
import RacersEdgePage   from '@/components/racers-edge/RacersEdgePage'
import ChatBot          from '@/components/ui/ChatBot'

export default function Home() {
  const { currentView, setView, setVehicle, clearVehicle, setSearchQuery, clearSearchQuery, syncViewFromUrl } = useAppStore()

  useEffect(() => {
    const shouldRestore = consumeCatalogNavigationPending() || hasCatalogReturnQuery()
    if (!shouldRestore) return

    const snapshot = readCatalogNavigationSnapshot()
    clearCatalogReturnQuery()
    if (!snapshot) return

    if (snapshot.vehicle) {
      setVehicle(snapshot.vehicle)
    } else {
      clearVehicle()
    }

    if (snapshot.searchQuery) {
      setSearchQuery(snapshot.searchQuery)
    } else {
      clearSearchQuery()
    }

    setView('results')
  }, [clearSearchQuery, clearVehicle, setSearchQuery, setVehicle, setView])

  // ── Sincronización vista <-> URL (?view=XXX) ──
  // Hace que el botón "atrás" del navegador funcione naturalmente entre
  // vistas internas (home/results/cart/garage/etc). Cuando setView se llama,
  // el store hace pushState; acá nos suscribimos al popstate del navegador
  // para que back/forward actualicen la vista.
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Al montar: si la URL ya tiene ?view=XXX, sincronizamos el store
    syncViewFromUrl()

    const handlePopState = () => syncViewFromUrl()
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [syncViewFromUrl])

  return (
    <>
      {/* ── Overlay views ── */}
      {currentView === 'results'     && <ResultsGrid />}
      {currentView === 'cart'        && <CartPage />}
      {currentView === 'garage'      && <GaragePage />}
      {currentView === 'racers-edge-home'    && <RacersEdgeHome />}
      {currentView === 'racers-edge-catalog' && <RacersEdgePage />}

      {/* ── Topbar: visible en home y garage ── */}
      {(currentView === 'home' || currentView === 'garage') && <Topbar currentView={currentView} />}

      {/* ── Navbar: visible en home y garage ── */}
      {(currentView === 'home' || currentView === 'garage') && <Navbar isSticky={false} transparent={currentView === 'garage'} />}

      {/* ── Landing (visible solo en home) ── */}
      <div style={{ display: currentView === 'home' ? 'block' : 'none' }}>
        <main>
          <HeroSection />
          <LetterSection />
          <CategoryGrid />
          <HowItWorks />
          <CommunitySection />
          <WaitlistSection />
        </main>
        <Footer />
      </div>

      {/* ── Chatbot (siempre visible excepto en garage) ── */}
      {currentView !== 'garage' && <ChatBot />}
    </>
  )
}
