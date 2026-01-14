"use client"

import { useState } from 'react'
import { Phone, Mail, MapPin, Calendar, Gauge, Fuel, Settings, Check, ArrowLeft, Share2, Heart, ChevronLeft, ChevronRight, X } from 'lucide-react'
import Link from 'next/link'

interface Vehicle {
  id: number
  title: string
  price: number
  year: number
  mileage: number
  image: string
  images?: string[]
  fuelType: string
  transmission: string
  color?: string
  location: string
  isFeatured: boolean
  features: string[]
  description?: string
  make?: string
  model?: string
  bodyType?: string
  engine?: string
  condition?: string
  owners?: number
  vin?: string
  sellerName?: string
  sellerPhone?: string
  sellerEmail?: string
}

export default function VehicleClient({ vehicle }: { vehicle: Vehicle }) {
  const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : vehicle.image ? [vehicle.image] : []
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formatPrice = (price: number) => `R${price.toLocaleString()}`

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleWhatsApp = () => {
    let phone = vehicle.sellerPhone || '0723248098'
    // Convert SA number to international format: 0723248098 -> 27723248098
    if (phone.startsWith('0')) {
      phone = '27' + phone.substring(1)
    }
    const message = `Hi, I'm interested in the ${vehicle.title} (${vehicle.year}) listed on IdealCar for ${formatPrice(vehicle.price)}`
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleShare = async () => {
    const url = window.location.href
    const title = `${vehicle.year} ${vehicle.title}`
    const text = `Check out this ${title} for ${formatPrice(vehicle.price)} on IdealCar`

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          copyToClipboard(url)
        }
      }
    } else {
      copyToClipboard(url)
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    alert('✅ Link copied to clipboard!')
  }

  const handleSave = () => {
    alert('✅ Vehicle saved to favorites!')
  }

  const openContactModal = () => {
    setShowContactModal(true)
  }

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/vehicle-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contactForm,
          vehicleTitle: vehicle.title,
          vehiclePrice: formatPrice(vehicle.price),
          vehicleId: vehicle.id,
        }),
      })

      if (response.ok) {
        alert('✅ Message sent successfully! We will contact you soon.')
        setContactForm({ name: '', surname: '', phone: '', email: '', message: '' })
        setShowContactModal(false)
      } else {
        alert('❌ Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-12 md:py-16">
        <div className="container-custom">
          <Link 
            href="/vehicles" 
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-6 md:mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Vehicles
          </Link>
          
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {vehicle.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 md:gap-6 text-blue-100 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{vehicle.location}</span>
              </div>
              {vehicle.isFeatured && (
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                  Featured
                </span>
              )}
            </div>
            
            <div className="text-3xl md:text-4xl font-bold">{formatPrice(vehicle.price)}</div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 text-white hover:text-gray-300 transition-colors"
              >
                <ChevronLeft className="w-12 h-12" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 text-white hover:text-gray-300 transition-colors"
              >
                <ChevronRight className="w-12 h-12" />
              </button>
            </>
          )}
          <img 
            src={images[currentImageIndex]} 
            alt={vehicle.title}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Contact Seller</h3>
                  <p className="text-blue-100 text-sm">{vehicle.title}</p>
                  <p className="text-blue-200 text-sm font-semibold">{formatPrice(vehicle.price)}</p>
                </div>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmitEnquiry} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Surname *</label>
                <input
                  type="text"
                  value={contactForm.surname}
                  onChange={(e) => setContactForm({ ...contactForm, surname: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Doe"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number *</label>
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="082 123 4567"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message (Optional)</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="I'm interested in this vehicle..."
                ></textarea>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {isSubmitting ? 'Sending...' : 'Send Enquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content */}
      <section className="container-custom py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery with Carousel */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {images.length > 0 ? (
                  <>
                    <div className="relative w-full aspect-square md:aspect-video group bg-gray-50">
                      <img 
                        src={images[currentImageIndex]} 
                        alt={vehicle.title}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setShowLightbox(true)}
                      />
                      
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 md:p-3 rounded-full shadow-lg transition-all"
                          >
                            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 md:p-3 rounded-full shadow-lg transition-all"
                          >
                            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                          </button>
                          <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm">
                            {currentImageIndex + 1} / {images.length}
                          </div>
                        </>
                      )}
                    </div>
                    
                    {images.length > 1 && (
                      <div className="p-3 md:p-4 flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide">
                        {images.map((img, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                              currentImageIndex === index ? 'border-blue-600 scale-105' : 'border-transparent hover:border-gray-300'
                            }`}
                          >
                            <img 
                              src={img} 
                              alt={`${vehicle.title} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="aspect-square md:aspect-video bg-gradient-to-br from-blue-100 to-gray-200 flex items-center justify-center">
                    <div className="text-4xl md:text-6xl">🚗</div>
                  </div>
                )}
              </div>

              {/* Vehicle Specifications */}
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                <h2 className="text-xl md:text-2xl font-bold mb-6">Vehicle Specifications</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Year</div>
                      <div className="font-bold text-lg">{vehicle.year}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                      <Gauge className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Mileage</div>
                      <div className="font-bold text-lg">{vehicle.mileage.toLocaleString()} km</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                      <Fuel className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Fuel Type</div>
                      <div className="font-bold text-lg">{vehicle.fuelType}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                      <Settings className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Transmission</div>
                      <div className="font-bold text-lg">{vehicle.transmission}</div>
                    </div>
                  </div>

                  {vehicle.color && (
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-100 text-gray-600 rounded-lg">
                        <div className="w-6 h-6">🎨</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Color</div>
                        <div className="font-bold text-lg">{vehicle.color}</div>
                      </div>
                    </div>
                  )}

                  {vehicle.bodyType && (
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                        <div className="w-6 h-6">🚙</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Body Type</div>
                        <div className="font-bold text-lg">{vehicle.bodyType}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              {vehicle.features && vehicle.features.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">Features & Options</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {vehicle.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {vehicle.description && (
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">Description</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm md:text-base">
                    {vehicle.description}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column - Contact */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 lg:sticky lg:top-8">
                <h2 className="text-2xl font-bold mb-6">Contact Seller</h2>
                
                {vehicle.sellerName && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-lg mb-1">{vehicle.sellerName}</div>
                    <div className="text-sm text-gray-600">Private Seller</div>
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  {vehicle.sellerPhone && (
                    <a 
                      href={`tel:${vehicle.sellerPhone.startsWith('0') ? '+27' + vehicle.sellerPhone.substring(1) : vehicle.sellerPhone}`}
                      className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Phone className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="text-sm text-gray-600">Phone</div>
                        <div className="font-semibold">{vehicle.sellerPhone}</div>
                      </div>
                    </a>
                  )}
                  
                  {vehicle.sellerEmail && (
                    <a 
                      href={`mailto:${vehicle.sellerEmail}`}
                      className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Mail className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="text-sm text-gray-600">Email</div>
                        <div className="font-semibold text-sm">{vehicle.sellerEmail}</div>
                      </div>
                    </a>
                  )}
                </div>

                <button 
                  onClick={openContactModal}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 md:py-4 rounded-lg transition-colors mb-3 text-sm md:text-base"
                >
                  Contact Seller
                </button>
                
                <button 
                  onClick={handleWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 md:py-4 rounded-lg transition-colors mb-4 text-sm md:text-base"
                >
                  WhatsApp Seller
                </button>

                <div className="flex gap-3">
                  <button 
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                    Save
                  </button>
                  <button 
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                </div>

                {/* Quick Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold mb-4">Quick Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Listed ID:</span>
                      <span className="font-semibold">#{vehicle.id}</span>
                    </div>
                    {vehicle.condition && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Condition:</span>
                        <span className="font-semibold">{vehicle.condition}</span>
                      </div>
                    )}
                    {vehicle.owners && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Previous Owners:</span>
                        <span className="font-semibold">{vehicle.owners}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Safety Notice */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">Safety Tips</h4>
                  <ul className="text-xs text-yellow-800 space-y-1">
                    <li>• Meet in a safe, public location</li>
                    <li>• Inspect the vehicle thoroughly</li>
                    <li>• Verify all documentation</li>
                    <li>• Consider a professional inspection</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Vehicles */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8 text-center">Similar Vehicles</h2>
          <div className="text-center text-gray-600">
            <p>More vehicles coming soon...</p>
            <Link href="/vehicles" className="text-blue-600 hover:underline mt-4 inline-block">
              Browse All Vehicles
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
