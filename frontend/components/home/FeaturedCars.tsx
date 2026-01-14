// components/home/FeaturedCars.tsx
'use client'

import { useEffect, useState } from 'react'
import CarCard from '@/components/CarCard'

const FeaturedCars = () => {
  const [cars, setCars] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    const fetchCars = async () => {
      try {
        const res = await fetch('/api/vehicles')
        if (res.ok) {
          const data = await res.json()
          if (mounted) setCars((data || []).filter((c: any) => c.isFeatured))
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchCars()
    return () => { mounted = false }
  }, [])

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-4">Featured Vehicles</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium vehicles, each carefully inspected and ready for your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.slice(0, 3).map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/vehicles"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group"
          >
            View All Vehicles
            <svg 
              className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCars