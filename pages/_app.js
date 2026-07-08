import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import '../styles/globals.css'
import Navbar from '../components/Navbar'
import { Bell, Loader2 } from 'lucide-react'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const [isStartupLoading, setIsStartupLoading] = useState(true)
  const [isRouteChanging, setIsRouteChanging] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Startup loader timer
    const timer = setTimeout(() => {
      setFadeOut(true)
      const removeTimer = setTimeout(() => {
        setIsStartupLoading(false)
      }, 500) // matches transition duration
      return () => clearTimeout(removeTimer)
    }, 1200)

    // Router events for page transitions
    const handleStart = () => setIsRouteChanging(true)
    const handleComplete = () => setIsRouteChanging(false)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      clearTimeout(timer)
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  return (
    <>
      {/* 🚀 Premium Startup Splash Screen */}
      {isStartupLoading && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 text-white transition-all duration-500 ease-in-out ${
            fadeOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="flex flex-col items-center gap-6">
            {/* Pulsing Gradient Icon */}
            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-xl shadow-indigo-500/30 animate-bounce">
              <Bell className="h-10 w-10 text-white animate-pulse" />
            </div>
            
            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-black tracking-wider bg-gradient-to-r from-indigo-400 via-violet-200 to-white bg-clip-text text-transparent">
                NoticeBoard
              </h1>
              <p className="text-sm font-semibold tracking-widest text-indigo-400 uppercase">
                Announcements Hub
              </p>
            </div>

            {/* Spinner and Loading Progress */}
            <div className="flex flex-col items-center gap-3 mt-4">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
              <div className="h-1 w-32 bg-slate-800 rounded-full overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-400 rounded-full animate-loading-bar"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🧭 Top Page Route Transition Progress Bar */}
      {isRouteChanging && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 z-50 shadow-md">
          <div className="h-full bg-white/20 animate-pulse"></div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex min-h-screen flex-col bg-slate-50/50">
        <Navbar />
        <main className="flex-1">
          <Component {...pageProps} />
        </main>
      </div>
    </>
  )
}

