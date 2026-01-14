"use client"
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import SearchFilter from '@/components/SearchFilter'
import CarCard from '@/components/CarCard'

export default function VehiclesPage() {
  const searchParams = useSearchParams()
  const [cars, setCars] = useState<any[]>([])
  const [allCars, setAllCars] = useState<any[]>([])
  const [visible, setVisible] = useState(9)

  useEffect(() => {
    let mounted = true
    const fetchCars = async () => {
      try {
        const res = await fetch('/api/vehicles')
        if (res.ok) {
          const data = await res.json()
          if (mounted) {
            setAllCars(data || [])
            setCars(data || [])
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchCars()
    return () => { mounted = false }
  }, [])

  // Apply URL search parameter on load
  useEffect(() => {
    const searchQuery = searchParams.get('search')
    if (searchQuery && allCars.length > 0) {
      handleFilter({ search: searchQuery })
    }
  }, [searchParams, allCars])

  const handleFilter = (f: any) => {
    if (!allCars || allCars.length === 0) return
    let res = [...allCars]
    
    // Only apply search filter if there's a search term
    if (f.search && f.search.trim()) {
      const q = f.search.toLowerCase().trim()
      res = res.filter(c => 
        (c.title || '').toLowerCase().includes(q) || 
        (c.location || '').toLowerCase().includes(q) || 
        (c.features || []).join(' ').toLowerCase().includes(q) || 
        ((c.make || c.brand || '') + '').toLowerCase().includes(q) ||
        (c.fuelType || '').toLowerCase().includes(q) ||
        (c.transmission || '').toLowerCase().includes(q)
      )
    }
    
    if (f.brand && f.brand.trim()) {
      const b = f.brand.toLowerCase().trim()
      res = res.filter(c => ((c.make || c.brand || c.title) || '').toLowerCase().includes(b))
    }
    if (f.priceMin != null && f.priceMin > 0) res = res.filter(c => (c.price || 0) >= f.priceMin)
    if (f.priceMax != null && f.priceMax > 0) res = res.filter(c => (c.price || 0) <= f.priceMax)
    if (f.yearFrom) res = res.filter(c => (c.year || 0) >= f.yearFrom)
    if (f.yearTo) res = res.filter(c => (c.year || 0) <= f.yearTo)
    if (f.transmission && f.transmission !== 'Any') res = res.filter(c => ((c.transmission || '') + '').toLowerCase() === (f.transmission || '').toLowerCase())
    if (f.fuels && f.fuels.length) res = res.filter(c => f.fuels.includes((c.fuelType || '').toString()))
    
    setCars(res)
    setVisible(9) // Reset visible count when filtering
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Browse Our Vehicles
            </h1>
            <p className="text-xl md:text-2xl text-blue-100">
              Discover our extensive collection of premium vehicles
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
        
        <SearchFilter onFilter={handleFilter} />
        
        <div className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.slice(0, visible).map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            {visible < cars.length ? (
              <button onClick={() => setVisible(v => v + 9)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center">
                Load More Vehicles
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
                </svg>
              </button>
            ) : (
              <p className="text-gray-600">No more vehicles to load</p>
            )}
          </div>
        </div>
        
        </div>
      </section>
    </main>
  )
}
