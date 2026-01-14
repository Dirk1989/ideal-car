// components/CarCard.tsx
'use client'

import { Heart, Share2, MapPin, MessageCircle, Facebook } from 'lucide-react'
import { useState } from 'react'
import ImageModal from './ImageModal'
import Link from 'next/link'
import { getVehicleUrl } from '@/lib/slugify'

interface CarCardProps {
  car: {
    id: number
    title: string
    price: number
    image: string
    year: number
    mileage: number
    fuelType: string
    transmission: string
    features: string[]
    location: string
    isFeatured?: boolean
  }
}

const CarCard = ({ car }: CarCardProps) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const images: string[] = ((car as any).images && (car as any).images.length > 0) ? (car as any).images : car.image ? [car.image] : []
  const [currentIndex, setCurrentIndex] = useState(0)
  const [openModal, setOpenModal] = useState(false)

  // Format price with South African Rand
  const formatPrice = (price: number) => {
    return `R${price.toLocaleString()}`
  }

  // Format mileage with km
  const formatMileage = (mileage: number) => {
    return `${mileage.toLocaleString()} km`
  }

  // Share functionality
  const handleShare = (platform: string) => {
    const vehicleUrl = getVehicleUrl({ id: car.id, year: car.year, title: car.title, location: car.location })
    const url = `${window.location.origin}${vehicleUrl}`
    const text = `Check out this ${car.year} ${car.title} for ${formatPrice(car.price)}!`
    
    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
        break
    }
    setShowShareMenu(false)
  }

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        {images && images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={images[currentIndex]}
            alt={car.title}
            onClick={() => setOpenModal(true)}
            className={`cursor-pointer object-cover w-full h-full transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
          />
        ) : (
          <div 
            className="h-full w-full bg-gradient-to-br from-blue-100 to-gray-200 transition-transform duration-500"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-4xl">🚗</div>
            </div>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {car.isFeatured && (
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </span>
          )}
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            SA 🇿🇦
          </span>
        </div>
        
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <Heart 
              className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
            {showShareMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10">
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm"
                >
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  Share on WhatsApp
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm"
                >
                  <Facebook className="h-4 w-4 text-blue-600" />
                  Share on Facebook
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm"
                >
                  <Share2 className="h-4 w-4 text-gray-600" />
                  Copy Link
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Carousel arrows on hover */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((i) => (i - 1 + images.length) % images.length)}
              className={`absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrentIndex((i) => (i + 1) % images.length)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
              aria-label="Next"
            >
              ›
            </button>
          </>
        )}
      </div>

      {openModal && (
        <ImageModal images={images} startIndex={currentIndex} onClose={() => setOpenModal(false)} />
      )}

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900">{car.title}</h3>
          <span className="text-2xl font-bold text-blue-600">
            {formatPrice(car.price)}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">{car.location}</span>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-gray-600">
            <span className="text-sm font-medium">Year:</span>
            <span className="ml-2 font-semibold">{car.year}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="text-sm font-medium">Mileage:</span>
            <span className="ml-2 font-semibold">{formatMileage(car.mileage)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="text-sm font-medium">Fuel:</span>
            <span className="ml-2 font-semibold">{car.fuelType}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="text-sm font-medium">Transmission:</span>
            <span className="ml-2 font-semibold">{car.transmission}</span>
          </div>
        </div>

        {/* Features */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {car.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
              >
                {feature}
              </span>
            ))}
            {car.features.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                +{car.features.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Link 
            href={getVehicleUrl({ id: car.id, year: car.year, title: car.title, location: car.location })}
            className="flex-1 btn-primary text-center py-3"
          >
            View Details
          </Link>
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className="px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center"
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CarCard