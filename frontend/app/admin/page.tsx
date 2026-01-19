"use client"

import { useState, useEffect } from 'react'
import AdminHeader from './components/AdminHeader'
import AdminSidebar from './components/AdminSidebar'
import CarForm from './components/CarForm'
import { Lock, Plus, Car, Users, FileText, Edit, Trash2, Eye, Droplet, Zap, Phone } from 'lucide-react'

interface CarListing {
  id: number
  title: string
  price: number
  year: number
  mileage: number
  image?: string
  fuelType: string
  transmission: string
  color?: string
  make?: string
  model?: string
  bodyType?: string
  location: string
  isFeatured: boolean
  status: 'active' | 'sold' | 'pending'
  views: number
  createdAt: string
  dealerId?: number
  description?: string
  features?: string[]
}

interface BlogPost {
  id: number
  title: string
  excerpt: string
  category: string
  author: string
  status: 'published' | 'draft'
  views: number
  createdAt: string
}

interface Dealer {
  id: number
  name: string
  owner: string
  phone: string
  email: string
  address: string
  notes: string
  createdAt: string
  vehicleCount?: number
}

interface Lead {
  id: number
  name: string
  carMake?: string
  carModel?: string
  phone: string
  email?: string
  createdAt: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  
  // Modals
  const [showAddCarModal, setShowAddCarModal] = useState(false)
  const [showEditCarModal, setShowEditCarModal] = useState(false)
  const [editingCar, setEditingCar] = useState<CarListing | null>(null)
  const [showAddBlogModal, setShowAddBlogModal] = useState(false)
  const [showAddDealerModal, setShowAddDealerModal] = useState(false)

  // Data
  const [carListings, setCarListings] = useState<CarListing[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [dealers, setDealers] = useState<Dealer[]>([])
  const [recentLeads, setRecentLeads] = useState<Lead[]>([])

  // Site settings
  const [siteName, setSiteName] = useState<string>('')
  const [tagline, setTagline] = useState<string>('')
  const [uploading, setUploading] = useState(false)

  // Dealer filtering
  const [selectedDealer, setSelectedDealer] = useState<number | null>(null)
  const [dealerSearchTerm, setDealerSearchTerm] = useState('')

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    const expires = localStorage.getItem('admin_expires')

    if (token && expires) {
      const expiresAt = parseInt(expires)
      if (Date.now() < expiresAt) {
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_expires')
        window.location.href = '/admin/login'
      }
    } else {
      window.location.href = '/admin/login'
    }
  }, [])

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesRes, blogsRes, dealersRes, leadsRes, siteRes] =
          await Promise.all([
            fetch('/api/vehicles'),
            fetch('/api/blogs'),
            fetch('/api/dealers'),
            fetch('/api/leads'),
            fetch('/api/site'),
          ])

        if (vehiclesRes.ok) setCarListings(await vehiclesRes.json())
        if (blogsRes.ok) setBlogPosts(await blogsRes.json())
        if (dealersRes.ok) setDealers(await dealersRes.json())
        if (leadsRes.ok) setRecentLeads(await leadsRes.json())
        if (siteRes.ok) {
          const site = await siteRes.json()
          if (site.siteName) setSiteName(site.siteName)
          if (site.tagline) setTagline(site.tagline)
        }
      } catch (e) {
        console.error('Failed to fetch data', e)
      }
    }

    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_expires')
    localStorage.removeItem('admin_user')
    sessionStorage.removeItem('admin_auth')
    window.location.href = '/admin/login'
  }

  const handleCreateCar = async (formData: FormData) => {
    const title = String(formData.get('title') || '')
    const price = Number(formData.get('price') || 0)
    const year = Number(formData.get('year') || 0)
    const mileage = Number(formData.get('mileage') || 0)
    const fuelType = String(formData.get('fuelType') || '')
    const transmission = String(formData.get('transmission') || '')
    const color = String(formData.get('color') || '')
    const make = String(formData.get('make') || '')
    const model = String(formData.get('model') || '')
    const bodyType = String(formData.get('bodyType') || '')
    const location = String(formData.get('location') || '')
    const features = String(formData.get('features') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const description = String(formData.get('description') || '')
    const isFeatured = Boolean(formData.get('isFeatured'))
    const dealerId = formData.get('dealerId')

    const files = formData.getAll('images') as File[]
    const imagesBase64: string[] = []

    if (files && files.length > 0) {
      setUploading(true)
      for (const file of files) {
        try {
          const b64 = await toBase64(file)
          if (b64) imagesBase64.push(b64)
        } catch (err) {
          console.error('Failed to convert file', err)
        }
      }
      setUploading(false)
    }

    const payload = {
      title,
      price,
      year,
      mileage,
      fuelType,
      transmission,
      color,
      make,
      model,
      bodyType,
      location,
      features,
      description,
      isFeatured,
      imagesBase64,
      dealerId: dealerId ? Number(dealerId) : null,
    }

    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const created = await res.json()
        setCarListings((prev) => [created, ...prev])
        setShowAddCarModal(false)
      } else {
        const errorText = await res.text()
        console.error('API error:', res.status, errorText)
        alert(`Failed to create vehicle: ${res.status} ${errorText}`)
      }
    } catch (err) {
      console.error('Request error:', err)
      alert(`Failed to create vehicle: ${err}`)
    }
  }

  const handleUpdateCar = async (formData: FormData) => {
    if (!editingCar) return

    const title = String(formData.get('title') || '')
    const price = Number(formData.get('price') || 0)
    const year = Number(formData.get('year') || 0)
    const mileage = Number(formData.get('mileage') || 0)
    const fuelType = String(formData.get('fuelType') || '')
    const transmission = String(formData.get('transmission') || '')
    const color = String(formData.get('color') || '')
    const make = String(formData.get('make') || '')
    const model = String(formData.get('model') || '')
    const bodyType = String(formData.get('bodyType') || '')
    const location = String(formData.get('location') || '')
    const features = String(formData.get('features') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const description = String(formData.get('description') || '')
    const isFeatured = Boolean(formData.get('isFeatured'))
    const dealerId = formData.get('dealerId')

    const files = formData.getAll('images') as File[]
    const imagesBase64: string[] = []

    if (files && files.length > 0) {
      setUploading(true)
      for (const file of files) {
        try {
          const b64 = await toBase64(file)
          if (b64) imagesBase64.push(b64)
        } catch (err) {
          console.error('Failed to convert file', err)
        }
      }
      setUploading(false)
    }

    const payload: any = {
      id: editingCar.id,
      title,
      price,
      year,
      mileage,
      fuelType,
      transmission,
      color,
      make,
      model,
      bodyType,
      location,
      features,
      description,
      isFeatured,
      dealerId: dealerId ? Number(dealerId) : null,
    }

    if (imagesBase64.length > 0) {
      payload.imagesBase64 = imagesBase64
    }

    try {
      const res = await fetch('/api/vehicles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const updated = await res.json()
        setCarListings((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
        setShowEditCarModal(false)
        setEditingCar(null)
      } else {
        const errorText = await res.text()
        console.error('API error:', res.status, errorText)
        alert(`Failed to update vehicle: ${res.status} ${errorText}`)
      }
    } catch (err) {
      console.error('Request error:', err)
      alert(`Failed to update vehicle: ${err}`)
    }
  }

  const handleDeleteCar = (id: number) => {
    if (!confirm('Are you sure?')) return
    ;(async () => {
      try {
        const res = await fetch('/api/vehicles', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        })
        if (res.ok) {
          setCarListings((prev) => prev.filter((c) => c.id !== id))
        } else {
          alert('Failed to delete vehicle')
        }
      } catch (err) {
        console.error(err)
        alert('Failed to delete vehicle')
      }
    })()
  }

  const handleEditCar = (car: CarListing) => {
    setEditingCar(car)
    setShowEditCarModal(true)
  }

  const handleDeleteBlog = (id: number) => {
    if (!confirm('Are you sure?')) return
    ;(async () => {
      try {
        const res = await fetch('/api/blogs', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        })
        if (res.ok) {
          setBlogPosts((prev) => prev.filter((b) => b.id !== id))
        } else {
          alert('Failed to delete blog')
        }
      } catch (err) {
        console.error(err)
        alert('Failed to delete blog')
      }
    })()
  }

  const handleCreateBlog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const title = String(data.get('title') || '')
    const excerpt = String(data.get('excerpt') || '')
    const category = String(data.get('category') || 'General')
    const author = String(data.get('author') || 'Admin')
    const status = String(data.get('status') || 'published')
    const readTime = String(data.get('readTime') || '3 min read')
    const content = String(data.get('content') || '')

    const file = data.get('image') as File | null
    let imageBase64: string | undefined

    if (file && file.size > 0) {
      try {
        setUploading(true)
        imageBase64 = await toBase64(file) || undefined
      } catch (e) {
        console.error('Failed to convert blog image', e)
      } finally {
        setUploading(false)
      }
    }

    const payload = { title, excerpt, content, category, author, status, readTime, imageBase64 }

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const created = await res.json()
        setBlogPosts((prev) => [created, ...prev])
        form.reset()
        setShowAddBlogModal(false)
      } else {
        console.error('Failed to create blog', res.status)
        alert('Failed to create blog')
      }
    } catch (err) {
      console.error(err)
      alert('Failed to create blog')
    }
  }

  const toBase64 = (file: File) =>
    new Promise<string | null>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () =>
        resolve(typeof reader.result === 'string' ? reader.result : null)
      reader.onerror = (err) => reject(err)
      reader.readAsDataURL(file)
    })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Lock className="h-8 w-8 text-blue-600 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Checking Authentication...</h1>
          <p className="text-gray-600 mt-2">Please wait</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      label: 'Active Listings',
      value: carListings.length,
      icon: <Car className="h-6 w-6" />,
      change: '+2',
    },
    {
      label: 'Dealers',
      value: dealers.length,
      icon: <Users className="h-6 w-6" />,
      change: `${dealers.length}`,
    },
    {
      label: 'Total Blogs',
      value: blogPosts.length,
      icon: <FileText className="h-6 w-6" />,
      change: '+1',
    },
    {
      label: 'Total Leads',
      value: recentLeads.length,
      icon: <Users className="h-6 w-6" />,
      change: `+${recentLeads.length}`,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'sold':
        return 'bg-gray-100 text-gray-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader
        onMenuClick={() => setSidebarOpen(true)}
        onLogout={handleLogout}
        siteName={siteName}
      />

      <div className="flex gap-0 md:gap-0">
        {/* Sidebar */}
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
        />

        {/* Main content */}
        <main className="flex-1 w-full overflow-hidden">
          <div className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
            {/* Stats Grid */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-6 mb-4 sm:mb-6 md:mb-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg md:rounded-xl p-2 sm:p-3 md:p-6 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-1 sm:mb-2 md:mb-4">
                      <div className="p-1.5 sm:p-2 bg-blue-50 text-blue-600 rounded-lg">
                        {stat.icon}
                      </div>
                      <span className="text-green-600 text-xs md:text-sm font-semibold">
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-lg sm:text-xl md:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Actions - Overview */}
            {activeTab === 'overview' && (
              <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
                <h2 className="text-base sm:text-lg md:text-xl font-bold mb-3 md:mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                  <button
                    onClick={() => setShowAddCarModal(true)}
                    className="p-3 sm:p-4 md:p-6 border-2 border-dashed border-gray-300 rounded-lg md:rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors group text-left"
                  >
                    <Car className="h-5 sm:h-6 md:h-8 w-5 sm:w-6 md:w-8 text-gray-400 group-hover:text-blue-500 mb-1 sm:mb-2" />
                    <p className="font-semibold text-xs sm:text-sm md:text-base text-gray-900">Add New Car</p>
                    <p className="text-xs text-gray-600 mt-0.5 sm:mt-1">Add to listings</p>
                  </button>

                  <button
                    onClick={() => setShowAddBlogModal(true)}
                    className="p-3 sm:p-4 md:p-6 border-2 border-dashed border-gray-300 rounded-lg md:rounded-xl hover:border-green-500 hover:bg-green-50 transition-colors group text-left"
                  >
                    <FileText className="h-5 sm:h-6 md:h-8 w-5 sm:w-6 md:w-8 text-gray-400 group-hover:text-green-500 mb-1 sm:mb-2" />
                    <p className="font-semibold text-xs sm:text-sm md:text-base text-gray-900">
                      Create Blog
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5 sm:mt-1">Write article</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('leads')}
                    className="p-3 sm:p-4 md:p-6 border-2 border-dashed border-gray-300 rounded-lg md:rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-colors group text-left"
                  >
                    <Users className="h-5 sm:h-6 md:h-8 w-5 sm:w-6 md:w-8 text-gray-400 group-hover:text-purple-500 mb-1 sm:mb-2" />
                    <p className="font-semibold text-xs sm:text-sm md:text-base text-gray-900">
                      View Leads
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5 sm:mt-1">Manage leads</p>
                  </button>
                </div>
              </div>
            )}

            {/* Cars Section */}
            {activeTab === 'cars' && (
              <div className="space-y-4 md:space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                  <div className="w-full">
                    <h2 className="text-base sm:text-lg md:text-2xl font-bold">Car Listings</h2>
                    {selectedDealer && (
                      <div className="mt-2 flex items-center gap-2 flex-wrap text-xs sm:text-sm">
                        <span className="text-gray-600">
                          Filtering by:{' '}
                          <span className="font-semibold text-blue-600">
                            {dealers.find((d) => d.id === selectedDealer)?.name}
                          </span>
                        </span>
                        <button
                          onClick={() => setSelectedDealer(null)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowAddCarModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 md:px-4 rounded-lg inline-flex items-center gap-2 text-xs sm:text-sm md:text-base w-full sm:w-auto justify-center sm:justify-start"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Car</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                </div>

                {/* Grid view on mobile, table on desktop */}
                <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">
                            Car
                          </th>
                          <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">
                            Price
                          </th>
                          <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">
                            Location
                          </th>
                          <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">
                            Views
                          </th>
                          <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {carListings
                          .filter(
                            (car) => !selectedDealer || car.dealerId === selectedDealer
                          )
                          .map((car) => (
                            <tr
                              key={car.id}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="py-4 px-4 text-sm">
                                <p className="font-medium">{car.title}</p>
                                <p className="text-xs text-gray-500">
                                  {car.year} • {car.mileage.toLocaleString()} km
                                </p>
                              </td>
                              <td className="py-4 px-4 text-sm font-bold">
                                R{car.price.toLocaleString()}
                              </td>
                              <td className="py-4 px-4 text-sm text-gray-600">
                                {car.location}
                              </td>
                              <td className="py-4 px-4 text-sm">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                    car.status
                                  )}`}
                                >
                                  {car.status}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-sm flex items-center gap-1">
                                <Eye className="h-4 w-4 text-gray-400" />
                                {car.views.toLocaleString()}
                              </td>
                              <td className="py-4 px-4 text-sm">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditCar(car)}
                                    className="p-2 hover:bg-blue-50 rounded text-blue-600"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCar(car.id)}
                                    className="p-2 hover:bg-red-50 rounded text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile card view */}
                <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {carListings
                    .filter((car) => !selectedDealer || car.dealerId === selectedDealer)
                    .map((car) => (
                      <div key={car.id} className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                          {car.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={car.image}
                              alt={car.title}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className="text-2xl">🚗</span>
                          )}
                        </div>
                        <h3 className="font-bold text-sm">{car.title}</h3>
                        <p className="text-xs text-gray-600 mt-1">
                          {car.location} • {car.year}
                        </p>
                        <p className="text-lg font-bold text-blue-600 mt-2">
                          R{Number(car.price).toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mt-2">
                          <Droplet className="h-3 w-3" />
                          <span>{car.fuelType}</span>
                          <Zap className="h-3 w-3 ml-1" />
                          <span>{car.transmission}</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleEditCar(car)}
                            className="flex-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCar(car.id)}
                            className="flex-1 px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Blogs Section */}
            {activeTab === 'blogs' && (
              <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 p-4 md:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg md:text-2xl font-bold">Blog Posts</h2>
                  <button
                    onClick={() => setShowAddBlogModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 md:px-4 rounded-lg inline-flex items-center gap-2 text-sm md:text-base"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Post</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 md:px-4 text-gray-600 font-medium">
                          Title
                        </th>
                        <th className="text-left py-3 px-2 md:px-4 text-gray-600 font-medium hidden md:table-cell">
                          Category
                        </th>
                        <th className="text-left py-3 px-2 md:px-4 text-gray-600 font-medium hidden sm:table-cell">
                          Author
                        </th>
                        <th className="text-left py-3 px-2 md:px-4 text-gray-600 font-medium">
                          Status
                        </th>
                        <th className="text-left py-3 px-2 md:px-4 text-gray-600 font-medium hidden sm:table-cell">
                          Views
                        </th>
                        <th className="text-left py-3 px-2 md:px-4 text-gray-600 font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogPosts.map((blog) => (
                        <tr key={blog.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-2 md:px-4">
                            <div>
                              <p className="font-medium text-xs md:text-sm">{blog.title}</p>
                              <p className="text-xs text-gray-500 truncate md:hidden">
                                {blog.excerpt}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-2 md:px-4 text-xs hidden md:table-cell">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                              {blog.category}
                            </span>
                          </td>
                          <td className="py-3 px-2 md:px-4 text-xs hidden sm:table-cell text-gray-600">
                            {blog.author}
                          </td>
                          <td className="py-3 px-2 md:px-4 text-xs">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                blog.status === 'published'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {blog.status}
                            </span>
                          </td>
                          <td className="py-3 px-2 md:px-4 text-xs hidden sm:table-cell">
                            {blog.views.toLocaleString()}
                          </td>
                          <td className="py-3 px-2 md:px-4">
                            <button
                              onClick={() => handleDeleteBlog(blog.id)}
                              className="p-1 md:p-2 hover:bg-red-50 rounded text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Leads Section */}
            {activeTab === 'leads' && (
              <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 p-4 md:p-6">
                <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">Recent Leads</h2>
                <div className="space-y-3">
                  {recentLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="flex items-center justify-between p-3 md:p-4 hover:bg-gray-50 rounded-lg border border-gray-100 flex-wrap gap-2"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-blue-600 text-sm">
                            {lead.name?.charAt(0) || 'L'}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm">{lead.name}</p>
                          <p className="text-xs text-gray-600">
                            {lead.phone}
                            {lead.email && ` • ${lead.email}`}
                          </p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-blue-50 rounded text-blue-600 flex-shrink-0">
                        <Phone className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <CarForm
        isOpen={showAddCarModal}
        onClose={() => setShowAddCarModal(false)}
        onSubmit={handleCreateCar}
        dealers={dealers}
        isLoading={uploading}
      />

      <CarForm
        isOpen={showEditCarModal}
        onClose={() => {
          setShowEditCarModal(false)
          setEditingCar(null)
        }}
        onSubmit={handleUpdateCar}
        dealers={dealers}
        isLoading={uploading}
        editingCar={editingCar || undefined}
      />

      {/* Add Blog Modal */}
      {showAddBlogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4 overflow-y-auto">
          <form onSubmit={handleCreateBlog} className="bg-white rounded-xl p-3 sm:p-4 md:p-6 w-full max-w-2xl my-4 sm:my-8">
            <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-base sm:text-lg md:text-xl font-bold">Create Blog Post</h3>
              <button 
                type="button" 
                onClick={() => setShowAddBlogModal(false)} 
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:gap-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input 
                  name="title" 
                  required 
                  placeholder="Enter blog post title" 
                  className="border p-2 md:p-3 rounded w-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Excerpt *</label>
                <textarea 
                  name="excerpt" 
                  required 
                  placeholder="Brief summary of the post" 
                  className="border p-2 md:p-3 rounded h-20 w-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input 
                    name="category" 
                    placeholder="e.g. Vehicle Maintenance" 
                    defaultValue="General"
                    className="border p-2 md:p-3 rounded w-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input 
                    name="author" 
                    placeholder="Author name" 
                    defaultValue="Admin"
                    className="border p-2 md:p-3 rounded w-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select 
                    name="status" 
                    defaultValue="published"
                    className="border p-2 md:p-3 rounded w-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Read Time</label>
                  <input 
                    name="readTime" 
                    placeholder="e.g. 5 min read" 
                    defaultValue="3 min read"
                    className="border p-2 md:p-3 rounded w-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Image</label>
                <input 
                  name="image" 
                  type="file" 
                  accept="image/*" 
                  className="border p-2 md:p-3 rounded w-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea 
                  name="content" 
                  placeholder="Full article content (supports basic markdown)" 
                  className="border p-2 md:p-3 rounded h-32 w-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button 
                type="button" 
                onClick={() => setShowAddBlogModal(false)} 
                className="px-3 sm:px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 text-xs sm:text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={uploading}
                className={`px-3 sm:px-4 py-2 rounded text-white font-medium text-xs sm:text-sm ${
                  uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {uploading ? 'Uploading...' : 'Create Post'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
