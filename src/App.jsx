import React, { useEffect, useState } from 'react'
import Lenis from '@studio-freight/lenis'
import CustomCursor from './components/CustomCursor'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import Projects from './components/Projects'
import Packages from './components/Packages'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [cursorVariant, setCursorVariant] = useState('default')

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <div className="app-container">
      <CustomCursor variant={cursorVariant} />
      <Header setCursorVariant={setCursorVariant} />
      <main>
        <Hero setCursorVariant={setCursorVariant} />
        <div id="projects">
          <Projects setCursorVariant={setCursorVariant} />
        </div>
        <div id="services">
          <Services setCursorVariant={setCursorVariant} />
          <Packages setCursorVariant={setCursorVariant} />
        </div>
      </main>
      <Footer setCursorVariant={setCursorVariant} />
    </div>
  )
}

export default App
