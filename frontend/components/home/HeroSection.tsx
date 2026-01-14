// components/home/HeroSection.tsx - SIMPLIFIED
'use client'

import { ArrowRight, Search, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const HeroSection = () => {
  const router = useRouter()
  const [currentImage, setCurrentImage] = useState(0)
  const [images, setImages] = useState<string[]>(['/hero-1.jpg','/hero-2.jpg','/hero-3.jpg'])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/site')
        if (res.ok) {
          const data = await res.json()
          if (mounted && Array.isArray(data.heroImages) && data.heroImages.length > 0) {
            setImages(data.heroImages)
          }
        }
      } catch (e) {
        // ignore
      }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (!images || images.length === 0) return
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [images])

  const stats = [
    { number: '10,000+', label: 'Active Listings' },
    { number: '500+', label: 'Trusted Sellers' },
    { number: '50,000+', label: 'Monthly Visitors' },
  ]

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/vehicles?search=${encodeURIComponent(searchTerm.trim())}`)
    } else {
      router.push('/vehicles')
    }
  }

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* Background image layer */}
        <div
          className="absolute inset-0 bg-center bg-cover transition-opacity duration-1000"
          style={{ backgroundImage: `url(${images[currentImage]})`, opacity: 1 }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-blue-600/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            <span className="text-blue-200 text-sm font-medium">South Africa's Car Marketplace</span>
          </div>
          
          <h1 className="heading-1 text-white mb-6">
            Find Your <span className="text-blue-400">Ideal</span> Car
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
  Browse our premium car collection or sell your car quickly for cash. 
  Your ideal car experience starts here at IdealCar.
</p>

          {/* Simple Search Bar */}
          <div className="bg-white rounded-xl p-2 mb-8 max-w-2xl">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="flex-grow relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search cars by make, model, or keyword..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors">
                Search
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 max-w-2xl">
            <Link
              href="/vehicles"
              className="bg-blue-900 hover:bg-blue-950 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 inline-flex items-center justify-center group"
            >
              Browse All Cars
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/sell-car"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 inline-flex items-center justify-center"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Sell Your Car
            </Link>
            <Link
              href="/contact"
              className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 inline-flex items-center justify-center"
            >
              <Search className="mr-2 h-5 w-5" />
              Book Inspection
            </Link>
          </div>

          {/* Stats - Commented out until we have real numbers */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center"
              >
                <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </section>
  )
}

export default HeroSection