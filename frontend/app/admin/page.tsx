// app/admin/page.tsx - FIXED WITH PHONE IMPORT
"use client"

import { useState, useEffect, useRef } from 'react'
import { 
  Car, FileText, Users, Settings, BarChart3, Upload, Shield, LogOut,
  Bell, Search, Plus, Trash2, Phone, Droplet, Zap, MessageCircle, Facebook,
  Eye, Edit, Lock
} from 'lucide-react'

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
  location: string
  isFeatured: boolean
  status: 'active' | 'sold' | 'pending'
  views: number
  createdAt: string
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

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddCarModal, setShowAddCarModal] = useState(false)
  const [showEditCarModal, setShowEditCarModal] = useState(false)
  const [editingCar, setEditingCar] = useState<CarListing | null>(null)
  const [showAddBlogModal, setShowAddBlogModal] = useState(false)
  const [showAddDealerModal, setShowAddDealerModal] = useState(false)
  const [carListings, setCarListings] = useState<CarListing[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [dealers, setDealers] = useState<Dealer[]>([])
  const [selectedDealer, setSelectedDealer] = useState<number | null>(null)
  const [dealerSearchTerm, setDealerSearchTerm] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [mainIndex, setMainIndex] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number[]>([])
  // site settings
  const [siteName, setSiteName] = useState<string>('')
  const [tagline, setTagline] = useState<string>('')
  const [heroFiles, setHeroFiles] = useState<File[]>([])
  const [heroPreviews, setHeroPreviews] = useState<string[]>([])
  const [siteUploading, setSiteUploading] = useState(false)
  const [siteMessage, setSiteMessage] = useState<string | null>(null)
  const [blogImageFile, setBlogImageFile] = useState<File | null>(null)
  const [blogImagePreview, setBlogImagePreview] = useState<string | null>(null)

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Check if already authenticated (from sessionStorage)
  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  // Check authentication on mount and redirect if needed
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    const expires = localStorage.getItem('admin_expires')
    
    if (token && expires) {
      const expiresAt = parseInt(expires)
      if (Date.now() < expiresAt) {
        setIsAuthenticated(true)
        sessionStorage.setItem('admin_auth', 'true')
      } else {
        // Token expired - redirect to login
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_expires')
        localStorage.removeItem('admin_user')
        window.location.href = '/admin/login'
      }
    } else {
      // No token - redirect to login
      window.location.href = '/admin/login'
    }
  }, [])

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_expires')
    localStorage.removeItem('admin_user')
    sessionStorage.removeItem('admin_auth')
    window.location.href = '/admin/login'
  }

  // Fetch vehicles & set blog mock
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch('/api/vehicles')
        if (res.ok) {
          const data = await res.json()
          setCarListings(data)
        }
      } catch (e) {
        console.error('Failed to fetch vehicles', e)
      }
    }

    fetchVehicles()
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs')
        if (res.ok) {
          const data = await res.json()
          setBlogPosts(data || [])
        }
      } catch (e) {
        console.error('Failed to fetch blogs', e)
      }
    }
    fetchBlogs()
  }, [])

  // Fetch dealers
  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const res = await fetch('/api/dealers')
        if (res.ok) {
          const data = await res.json()
          setDealers(data || [])
        }
      } catch (e) {
        console.error('Failed to fetch dealers', e)
      }
    }
    fetchDealers()
  }, [])

  const stats = [
    { label: 'Active Listings', value: carListings.length, icon: <Car className="h-6 w-6" />, change: '+2' },
    { label: 'Dealers', value: dealers.length, icon: <Users className="h-6 w-6" />, change: `${dealers.length}` },
    { label: 'Total Blogs', value: blogPosts.length, icon: <FileText className="h-6 w-6" />, change: '+1' },
    { label: 'Total Leads', value: '156', icon: <Users className="h-6 w-6" />, change: '+23%' },
  ]

  const [recentLeads, setRecentLeads] = useState<any[]>([])

  const handleDeleteLead = (id: number) => {
    if (!confirm('Delete this lead?')) return
    ;(async () => {
      try {
        const res = await fetch('/api/leads', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        })
        if (res.ok) {
          setRecentLeads(prev => prev.filter(l => l.id !== id))
        } else {
          alert('Failed to delete lead')
        }
      } catch (e) {
        console.error(e)
        alert('Failed to delete lead')
      }
    })()
  }

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch('/api/leads')
        if (res.ok) {
          const data = await res.json()
          setRecentLeads(data || [])
        }
      } catch (e) {
        console.error('Failed to fetch leads', e)
      }
    }
    fetchLeads()
  }, [])

  // fetch site config for header
  useEffect(() => {
    const fetchSite = async () => {
      try {
        const res = await fetch('/api/site')
        if (res.ok) {
          const data = await res.json()
          if (data) {
            if (data.siteName) setSiteName(data.siteName)
            if (data.tagline) setTagline(data.tagline)
          }
        }
      } catch (e) {
        // ignore
      }
    }
    fetchSite()
  }, [])

  const handleAddCar = () => {
    // In real app, this would open a form/modal
    setShowAddCarModal(true)
  }

  const handleAddBlog = () => {
    // In real app, this would open a form/modal
    setShowAddBlogModal(true)
  }

  const handleDeleteCar = (id: number) => {
    if (!confirm('Are you sure you want to delete this car listing?')) return
    ;(async () => {
      try {
        const res = await fetch('/api/vehicles', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        })
        if (res.ok) {
          setCarListings((prev) => prev.filter(car => car.id !== id))
        } else {
          console.error('Failed to delete vehicle', res.status)
          alert('Failed to delete vehicle')
        }
      } catch (err) {
        console.error(err)
        alert('Failed to delete vehicle')
      }
    })()
  }

  const handleDeleteBlog = (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return
    ;(async () => {
      try {
        const res = await fetch('/api/blogs', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        })
        if (res.ok) {
          setBlogPosts((prev) => prev.filter(b => b.id !== id))
        } else {
          alert('Failed to delete blog')
        }
      } catch (e) {
        console.error(e)
        alert('Failed to delete blog')
      }
    })()
  }

  const handleAddDealer = () => {
    setShowAddDealerModal(true)
  }

  const handleCreateDealer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    
    const payload = {
      name: String(data.get('name') || ''),
      owner: String(data.get('owner') || ''),
      phone: String(data.get('phone') || ''),
      email: String(data.get('email') || ''),
      address: String(data.get('address') || ''),
      notes: String(data.get('notes') || '')
    }

    try {
      const res = await fetch('/api/dealers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const created = await res.json()
        setDealers((prev) => [created, ...prev])
        form.reset()
        setShowAddDealerModal(false)
      } else {
        alert('Failed to create dealer')
      }
    } catch (err) {
      console.error(err)
      alert('Failed to create dealer')
    }
  }

  const handleDeleteDealer = (id: number) => {
    if (!confirm('Are you sure you want to delete this dealer?')) return
    ;(async () => {
      try {
        const res = await fetch('/api/dealers', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        })
        if (res.ok) {
          setDealers((prev) => prev.filter(d => d.id !== id))
        } else {
          alert('Failed to delete dealer')
        }
      } catch (e) {
        console.error(e)
        alert('Failed to delete dealer')
      }
    })()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'sold': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'contacted': return 'bg-purple-100 text-purple-800'
      case 'scheduled': return 'bg-orange-100 text-orange-800'
      case 'converted': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Helper to convert file to base64
  const toBase64 = (file: File) => new Promise<string | null>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null)
    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })

  // Cleanup previews when add-car modal closes to avoid stale object URLs
  useEffect(() => {
    if (!showAddCarModal) {
      previews.forEach(u => URL.revokeObjectURL(u))
      setSelectedFiles([])
      setPreviews([])
      setUploadProgress([])
      setUploadError(null)
      setMainIndex(null)
    }
  }, [showAddCarModal])

  // Handle selected images for preview/validation
  const onImagesSelected = (files: FileList | null) => {
    setUploadError(null)
    if (!files) {
      setSelectedFiles([])
      setPreviews([])
      setMainIndex(null)
      return
    }
    const arr = Array.from(files)
    if (arr.length > 10) {
      setUploadError('You can upload up to 10 images')
      arr.splice(10)
    }
    const valid: File[] = []
    const urls: string[] = []
    for (const f of arr) {
      if (!f.type.startsWith('image/')) continue
      if (f.size > 5 * 1024 * 1024) {
        setUploadError('Each image must be smaller than 5MB')
        continue
      }
      valid.push(f)
      urls.push(URL.createObjectURL(f))
    }
    // revoke old previews
    previews.forEach(u => URL.revokeObjectURL(u))
    setSelectedFiles(valid)
    setPreviews(urls)
    setUploadProgress(valid.map(() => 0))
    setMainIndex(valid.length > 0 ? 0 : null)
  }

  const handleCreateCar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const title = String(data.get('title') || '')
    const price = Number(data.get('price') || 0)
    const year = Number(data.get('year') || 0)
    const mileage = Number(data.get('mileage') || 0)
    const fuelType = String(data.get('fuelType') || '')
    const transmission = String(data.get('transmission') || '')
    const color = String(data.get('color') || '')
    const location = String(data.get('location') || '')
    const features = String(data.get('features') || '').split(',').map(s => s.trim()).filter(Boolean)
    const isFeatured = Boolean(data.get('isFeatured'))

    const imagesBase64: string[] = []
    const filesToUse: File[] = selectedFiles && selectedFiles.length > 0 ? selectedFiles : Array.from(data.getAll('images') as any[]).filter((f: any) => f instanceof File)
    if (filesToUse && filesToUse.length > 0) {
      // if admin selected a main image, move it to the front so server treats it as primary
      let ordered = filesToUse.slice(0)
      if (mainIndex !== null && mainIndex >= 0 && mainIndex < ordered.length) {
        const [m] = ordered.splice(mainIndex, 1)
        ordered.unshift(m)
      }
      const limited = ordered.slice(0, 10)
      setUploading(true)
      for (let i = 0; i < limited.length; i++) {
        const f = limited[i]
        try {
          // mark in-progress
          setUploadProgress(prev => { const next = prev.slice(); next[i] = 25; return next })
          const b = await toBase64(f)
          // mark converted
          setUploadProgress(prev => { const next = prev.slice(); next[i] = 60; return next })
          if (b) imagesBase64.push(b)
          // mark ready-to-upload
          setUploadProgress(prev => { const next = prev.slice(); next[i] = 90; return next })
        } catch (err) {
          console.error('Failed to convert file', err)
          setUploadProgress(prev => { const next = prev.slice(); next[i] = 0; return next })
        }
      }
      setUploading(false)
    }

    const payload = { 
      title, price, year, mileage, fuelType, transmission, color, location, features, isFeatured, imagesBase64,
      // Link to dealer if selected
      dealerId: selectedDealer
    }

    try {
      setUploadError(null)
      setUploading(true)
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const created = await res.json()
        setCarListings((prev) => [created, ...prev])
        form.reset()
        setShowAddCarModal(false)
        setSelectedDealer(null)
        setDealerSearchTerm('')
        // cleanup previews
        previews.forEach(u => URL.revokeObjectURL(u))
        setSelectedFiles([])
        setPreviews([])
        setUploadProgress([])
      } else {
        console.error('Failed to create vehicle', res.status)
      }
    } catch (err) {
      console.error(err)
    }
    setUploading(false)
  }

  const handleEditCar = (car: CarListing) => {
    setEditingCar(car)
    setShowEditCarModal(true)
    // Set dealer if vehicle has one
    if ((car as any).dealerId) {
      setSelectedDealer((car as any).dealerId)
    }
  }

  const handleUpdateCar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingCar) return
    
    const form = e.currentTarget
    const data = new FormData(form)
    const title = String(data.get('title') || '')
    const price = Number(data.get('price') || 0)
    const year = Number(data.get('year') || 0)
    const mileage = Number(data.get('mileage') || 0)
    const fuelType = String(data.get('fuelType') || '')
    const transmission = String(data.get('transmission') || '')
    const color = String(data.get('color') || '')
    const location = String(data.get('location') || '')
    const features = String(data.get('features') || '').split(',').map(s => s.trim()).filter(Boolean)
    const isFeatured = Boolean(data.get('isFeatured'))

    const imagesBase64: string[] = []
    if (selectedFiles && selectedFiles.length > 0) {
      let ordered = selectedFiles.slice(0)
      if (mainIndex !== null && mainIndex >= 0 && mainIndex < ordered.length) {
        const [m] = ordered.splice(mainIndex, 1)
        ordered.unshift(m)
      }
      const limited = ordered.slice(0, 10)
      setUploading(true)
      for (let i = 0; i < limited.length; i++) {
        const f = limited[i]
        try {
          const b = await toBase64(f)
          if (b) imagesBase64.push(b)
        } catch (err) {
          console.error('Failed to convert file', err)
        }
      }
      setUploading(false)
    }

    const payload: any = { 
      id: editingCar.id,
      title, price, year, mileage, fuelType, transmission, color, location, features, isFeatured,
      dealerId: selectedDealer
    }

    if (imagesBase64.length > 0) {
      payload.imagesBase64 = imagesBase64
    }

    try {
      setUploadError(null)
      setUploading(true)
      const res = await fetch('/api/vehicles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const updated = await res.json()
        setCarListings((prev) => prev.map(c => c.id === updated.id ? updated : c))
        form.reset()
        setShowEditCarModal(false)
        setEditingCar(null)
        setSelectedDealer(null)
        setDealerSearchTerm('')
        previews.forEach(u => URL.revokeObjectURL(u))
        setSelectedFiles([])
        setPreviews([])
        setUploadProgress([])
      } else {
        console.error('Failed to update vehicle', res.status)
        alert('Failed to update vehicle')
      }
    } catch (err) {
      console.error(err)
      alert('Failed to update vehicle')
    }
    setUploading(false)
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

    // Prefer selected blogImageFile (preview) if present
    const file = blogImageFile || (data.get('image') as File | null)
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

    const content = String(data.get('content') || '')
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
        if (blogImagePreview) {
          URL.revokeObjectURL(blogImagePreview)
          setBlogImagePreview(null)
          setBlogImageFile(null)
        }
      } else {
        console.error('Failed to create blog', res.status)
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Simple markdown helpers for blog content textarea
  const blogContentRef = useRef<HTMLTextAreaElement | null>(null)
  const applyWrap = (before: string, after: string = before) => {
    const el = blogContentRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const val = el.value
    const selected = val.substring(start, end)
    const newVal = val.substring(0, start) + before + selected + after + val.substring(end)
    el.value = newVal
    el.focus()
    const pos = start + before.length + selected.length + after.length
    el.setSelectionRange(pos, pos)
  }

  const applyLinePrefix = (prefix: string) => {
    const el = blogContentRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const val = el.value
    // find line starts
    const before = val.substring(0, start)
    const selection = val.substring(start, end)
    const after = val.substring(end)
    const lines = selection.split('\n')
    const prefixed = lines.map(l => (l.trim() ? prefix + l : l)).join('\n')
    const newVal = before + prefixed + after
    el.value = newVal
    el.focus()
    el.setSelectionRange(start, start + prefixed.length)
  }

  // Show loading or redirect while checking authentication
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  <span className="text-gray-900">Ideal</span>
                  <span className="text-blue-600">Car</span>
                  <span className="text-gray-900"> Admin</span>
                </h1>
                <p className="text-sm text-gray-600">Management Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-600">A</span>
                </div>
                <div>
                  <p className="font-medium">Admin User</p>
                  <p className="text-xs text-gray-500">Super Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <nav className="p-4">
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search admin..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              {[
                { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-5 w-5" /> },
                { id: 'cars', label: 'Car Listings', icon: <Car className="h-5 w-5" /> },
                { id: 'dealers', label: 'Dealers', icon: <Users className="h-5 w-5" /> },
                { id: 'blogs', label: 'Blog Posts', icon: <FileText className="h-5 w-5" /> },
                { id: 'leads', label: 'Sale Leads', icon: <Users className="h-5 w-5" /> },
                { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    {stat.icon}
                  </div>
                  <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={handleAddCar}
                className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors group"
              >
                <Car className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mb-3" />
                <p className="font-semibold text-gray-900">Add New Car</p>
                <p className="text-sm text-gray-600 mt-1">Add car to public listings</p>
              </button>
              
              <button 
                onClick={handleAddBlog}
                className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-colors group"
              >
                <FileText className="h-8 w-8 text-gray-400 group-hover:text-green-500 mb-3" />
                <p className="font-semibold text-gray-900">Create Blog Post</p>
                <p className="text-sm text-gray-600 mt-1">Write and publish article</p>
              </button>
              
              <button 
                onClick={() => setActiveTab('leads')}
                className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-colors group"
              >
                <Users className="h-8 w-8 text-gray-400 group-hover:text-purple-500 mb-3" />
                <p className="font-semibold text-gray-900">View Leads</p>
                <p className="text-sm text-gray-600 mt-1">Manage car sale leads</p>
              </button>
            </div>
          </div>

          {/* Add Car Modal */}
          {showAddCarModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleCreateCar} className="p-6">
                  <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-4">
                    <h3 className="text-lg font-bold">Add New Car</h3>
                    <button type="button" onClick={() => setShowAddCarModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Dealer Selection */}
                    <div className="md:col-span-2 border-b pb-4 mb-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Select Dealer (Optional)</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search dealers..."
                          value={dealerSearchTerm}
                          onChange={(e) => setDealerSearchTerm(e.target.value)}
                          className="w-full border p-2 rounded"
                        />
                        {dealerSearchTerm && (
                          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b max-h-48 overflow-y-auto z-20 shadow-lg">
                            {dealers
                              .filter(d => 
                                d.name.toLowerCase().includes(dealerSearchTerm.toLowerCase()) ||
                                d.owner.toLowerCase().includes(dealerSearchTerm.toLowerCase())
                              )
                              .map(dealer => (
                                <button
                                  key={dealer.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedDealer(dealer.id)
                                    setDealerSearchTerm(dealer.name)
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center justify-between"
                                >
                                  <div>
                                    <div className="font-semibold">{dealer.name}</div>
                                    <div className="text-xs text-gray-500">{dealer.owner} • {dealer.phone}</div>
                                  </div>
                                </button>
                              ))
                            }
                            {dealers.filter(d => 
                              d.name.toLowerCase().includes(dealerSearchTerm.toLowerCase()) ||
                              d.owner.toLowerCase().includes(dealerSearchTerm.toLowerCase())
                            ).length === 0 && (
                              <div className="px-3 py-2 text-gray-500 text-sm">No dealers found</div>
                            )}
                          </div>
                        )}
                      </div>
                      {selectedDealer && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-sm text-green-600 font-semibold">
                            ✓ Dealer selected: {dealers.find(d => d.id === selectedDealer)?.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDealer(null)
                              setDealerSearchTerm('')
                            }}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Clear
                          </button>
                        </div>
                      )}
                    </div>

                    <input name="title" required placeholder="Title (e.g. 2023 Tesla Model S)" className="border p-2 rounded" />
                  <input name="price" type="number" required placeholder="Price (R)" className="border p-2 rounded" />
                  <input name="year" type="number" placeholder="Year" className="border p-2 rounded" />
                  <input name="mileage" type="number" placeholder="Mileage (km)" className="border p-2 rounded" />
                  <input name="location" placeholder="Location" className="border p-2 rounded" />
                  <div>
                    <label className="text-sm text-gray-700">Fuel Type</label>
                    <select name="fuelType" defaultValue="Petrol" className="w-full border p-2 rounded mt-1">
                      <option>Petrol</option>
                      <option>Diesel</option>
                      <option>Electric</option>
                      <option>Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Transmission</label>
                    <select name="transmission" defaultValue="Manual" className="w-full border p-2 rounded mt-1">
                      <option>Manual</option>
                      <option>Automatic</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Colour</label>
                    <div className="mt-1 flex items-center gap-2">
                      <input name="color" placeholder="e.g. White" className="border p-2 rounded flex-1" />
                      <input type="color" onChange={(e) => {
                        const val = e.target.value
                        const prev = (e.target as HTMLInputElement).previousElementSibling as HTMLInputElement | null
                        if (prev) prev.style.borderColor = val
                      }} className="w-10 h-10 p-0 border rounded" />
                    </div>
                  </div>
                  <input name="features" placeholder="Features (comma separated)" className="border p-2 rounded" />
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Images (up to 10)</label>
                    <input name="images" type="file" accept="image/*" multiple className="border p-2 rounded w-full" onChange={(e) => onImagesSelected(e.target.files)} />
                    {uploadError && <p className="text-sm text-red-600 mt-2">{uploadError}</p>}
                    {previews.length > 0 && (
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {previews.map((src, idx) => (
                          <div key={idx} className="relative border rounded overflow-hidden bg-white shadow-sm">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={src} alt={`preview-${idx}`} className="object-cover w-28 h-20" />
                            {/* Make main button */}
                            <button type="button" onClick={() => setMainIndex(idx)} className={`absolute left-1 top-1 bg-white/80 rounded-full p-1 ${mainIndex === idx ? 'ring-2 ring-yellow-400' : ''}`} title="Make main">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 text-yellow-500" fill={mainIndex === idx ? 'currentColor' : 'none'} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.165c.969 0 1.371 1.24.588 1.81l-3.37 2.45a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.45a1 1 0 00-1.176 0l-3.37 2.45c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.06 9.384c-.783-.57-.38-1.81.588-1.81h4.165a1 1 0 00.95-.69L11.05 2.927z"/></svg>
                            </button>
                            {uploadProgress && uploadProgress[idx] !== undefined && (
                              <div className="absolute left-0 right-0 bottom-0">
                                <div className="h-1 bg-gray-200">
                                  <div style={{ width: `${uploadProgress[idx]}%` }} className="h-1 bg-blue-500 transition-width" />
                                </div>
                                <div className="absolute right-1 bottom-1 text-xs text-white bg-black/50 px-1 rounded">{uploadProgress[idx]}%</div>
                              </div>
                            )}
                            <div className="p-1 flex items-center justify-between">
                              <div className="text-xs text-gray-600 truncate max-w-[140px]">{selectedFiles[idx]?.name || ''}</div>
                              <button type="button" onClick={() => {
                                // remove selected file
                                const nextFiles = selectedFiles.slice()
                                nextFiles.splice(idx, 1)
                                const nextPreviews = previews.slice()
                                const removed = nextPreviews.splice(idx, 1)
                                removed.forEach(u => URL.revokeObjectURL(u))
                                setSelectedFiles(nextFiles)
                                setPreviews(nextPreviews)
                                const nextProg = uploadProgress.slice(); nextProg.splice(idx,1); setUploadProgress(nextProg)
                                // adjust mainIndex
                                if (mainIndex !== null) {
                                  if (idx === mainIndex) setMainIndex(nextFiles.length > 0 ? 0 : null)
                                  else if (idx < mainIndex) setMainIndex(mainIndex - 1)
                                }
                              }} className="ml-2 text-sm text-red-600">Remove</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 md:col-span-2">
                    <input name="isFeatured" type="checkbox" id="isFeatured" className="h-4 w-4" />
                    <label htmlFor="isFeatured" className="text-sm">Mark as featured</label>
                  </div>
                </div>

                <div className="flex justify-end mt-4 sticky bottom-0 bg-white pt-4 border-t">
                  <button type="button" onClick={() => setShowAddCarModal(false)} className="mr-3 px-4 py-2 rounded border hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={uploading} className={`px-4 py-2 rounded text-white font-semibold ${uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {uploading ? 'Uploading...' : 'Create Car'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          )}

          {/* Edit Car Modal */}
          {showEditCarModal && editingCar && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleUpdateCar} className="p-6">
                  <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-4">
                    <h3 className="text-lg font-bold">Edit Car</h3>
                    <button type="button" onClick={() => { setShowEditCarModal(false); setEditingCar(null); setSelectedDealer(null); setDealerSearchTerm(''); }} className="text-gray-500 hover:text-gray-700">✕</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Dealer Selection */}
                    <div className="md:col-span-2 border-b pb-4 mb-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Select Dealer (Optional)</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search dealers..."
                          value={dealerSearchTerm}
                          onChange={(e) => setDealerSearchTerm(e.target.value)}
                          className="w-full border p-2 rounded"
                        />
                        {dealerSearchTerm && (
                          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b max-h-48 overflow-y-auto z-20 shadow-lg">
                            {dealers
                              .filter(d => 
                                d.name.toLowerCase().includes(dealerSearchTerm.toLowerCase()) ||
                                d.owner.toLowerCase().includes(dealerSearchTerm.toLowerCase())
                              )
                              .map((dealer) => (
                                <button
                                  key={dealer.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedDealer(dealer.id)
                                    setDealerSearchTerm('')
                                  }}
                                  className="w-full px-3 py-2 text-left hover:bg-blue-50 border-b last:border-0"
                                >
                                  <div className="font-semibold text-gray-900">{dealer.name}</div>
                                  <div className="text-xs text-gray-600">{dealer.owner}</div>
                                </button>
                              ))}
                            {dealers.filter(d => 
                              d.name.toLowerCase().includes(dealerSearchTerm.toLowerCase()) ||
                              d.owner.toLowerCase().includes(dealerSearchTerm.toLowerCase())
                            ).length === 0 && (
                              <div className="px-3 py-2 text-gray-500 text-sm">No dealers found</div>
                            )}
                          </div>
                        )}
                      </div>
                      {selectedDealer && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-sm text-green-600 font-semibold">
                            ✓ Dealer selected: {dealers.find(d => d.id === selectedDealer)?.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDealer(null)
                              setDealerSearchTerm('')
                            }}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Clear
                          </button>
                        </div>
                      )}
                    </div>

                    <input name="title" required defaultValue={editingCar.title} placeholder="Title (e.g. 2023 Tesla Model S)" className="border p-2 rounded" />
                    <input name="price" type="number" required defaultValue={editingCar.price} placeholder="Price" className="border p-2 rounded" />
                    <input name="year" type="number" required defaultValue={editingCar.year} placeholder="Year" className="border p-2 rounded" />
                    <input name="mileage" type="number" defaultValue={editingCar.mileage} placeholder="Mileage (km)" className="border p-2 rounded" />
                    <input name="location" defaultValue={editingCar.location} placeholder="Location" className="border p-2 rounded" />
                    <div>
                      <label className="text-sm text-gray-700">Fuel Type</label>
                      <select name="fuelType" defaultValue={editingCar.fuelType} className="w-full border p-2 rounded mt-1">
                        <option>Petrol</option>
                        <option>Diesel</option>
                        <option>Electric</option>
                        <option>Hybrid</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Transmission</label>
                      <select name="transmission" defaultValue={editingCar.transmission} className="w-full border p-2 rounded mt-1">
                        <option>Manual</option>
                        <option>Automatic</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Colour</label>
                      <div className="mt-1 flex items-center gap-2">
                        <input name="color" defaultValue={editingCar.color || ''} placeholder="e.g. White" className="border p-2 rounded flex-1" />
                        <input type="color" defaultValue={editingCar.color || '#000000'} onChange={(e) => {
                          const val = e.target.value
                          const prev = (e.target as HTMLInputElement).previousElementSibling as HTMLInputElement | null
                          if (prev) {
                            prev.value = val
                            prev.style.borderColor = val
                          }
                        }} className="w-10 h-10 p-0 border rounded" />
                      </div>
                    </div>
                    <input name="features" defaultValue={(editingCar as any).features?.join(', ') || ''} placeholder="Features (comma separated)" className="border p-2 rounded" />
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Update Images (optional - leave empty to keep existing)</label>
                      <input name="images" type="file" accept="image/*" multiple className="border p-2 rounded w-full" onChange={(e) => onImagesSelected(e.target.files)} />
                      {uploadError && <p className="text-sm text-red-600 mt-2">{uploadError}</p>}
                      {previews.length > 0 && (
                        <div className="mt-3 grid grid-cols-4 gap-2">
                          {previews.map((src, idx) => (
                            <div key={idx} className="relative border rounded overflow-hidden bg-white shadow-sm">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={src} alt={`preview-${idx}`} className="object-cover w-28 h-20" />
                              <button type="button" onClick={() => setMainIndex(idx)} className={`absolute left-1 top-1 bg-white/80 rounded-full p-1 ${mainIndex === idx ? 'ring-2 ring-yellow-400' : ''}`} title="Make main">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 text-yellow-500" fill={mainIndex === idx ? 'currentColor' : 'none'} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.165c.969 0 1.371 1.24.588 1.81l-3.37 2.45a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.45a1 1 0 00-1.176 0l-3.37 2.45c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.06 9.384c-.783-.57-.38-1.81.588-1.81h4.165a1 1 0 00.95-.69L11.05 2.927z"/></svg>
                              </button>
                              <div className="p-1 flex items-center justify-between">
                                <div className="text-xs text-gray-600 truncate max-w-[140px]">{selectedFiles[idx]?.name || ''}</div>
                                <button type="button" onClick={() => {
                                  const nextFiles = selectedFiles.slice()
                                  nextFiles.splice(idx, 1)
                                  const nextPreviews = previews.slice()
                                  const removed = nextPreviews.splice(idx, 1)
                                  removed.forEach(u => URL.revokeObjectURL(u))
                                  setSelectedFiles(nextFiles)
                                  setPreviews(nextPreviews)
                                  if (mainIndex !== null) {
                                    if (idx === mainIndex) setMainIndex(nextFiles.length > 0 ? 0 : null)
                                    else if (idx < mainIndex) setMainIndex(mainIndex - 1)
                                  }
                                }} className="ml-2 text-sm text-red-600">Remove</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 md:col-span-2">
                      <input name="isFeatured" type="checkbox" id="editIsFeatured" defaultChecked={editingCar.isFeatured} className="h-4 w-4" />
                      <label htmlFor="editIsFeatured" className="text-sm">Mark as featured</label>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 sticky bottom-0 bg-white pt-4 border-t">
                    <button type="button" onClick={() => { setShowEditCarModal(false); setEditingCar(null); setSelectedDealer(null); setDealerSearchTerm(''); }} className="mr-3 px-4 py-2 rounded border hover:bg-gray-50">Cancel</button>
                    <button type="submit" disabled={uploading} className={`px-4 py-2 rounded text-white font-semibold ${uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                      {uploading ? 'Updating...' : 'Update Car'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add Blog Modal */}
          {showAddBlogModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <form onSubmit={handleCreateBlog} className="bg-white rounded-xl p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Create Blog Post</h3>
                  <button type="button" onClick={() => setShowAddBlogModal(false)} className="text-gray-500">Close</button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <input name="title" required placeholder="Title" className="border p-2 rounded" />
                  <textarea name="excerpt" required placeholder="Excerpt" className="border p-2 rounded h-24" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="category" placeholder="Category" className="border p-2 rounded" />
                    <input name="author" placeholder="Author" className="border p-2 rounded" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select name="status" className="border p-2 rounded">
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                    <input name="readTime" placeholder="Read time (e.g. 4 min read)" className="border p-2 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    <input name="image" type="file" accept="image/*" className="border p-2 rounded w-full" onChange={(e) => {
                      const f = e.target.files?.[0] || null
                      setBlogImageFile(f)
                      if (f) {
                        const url = URL.createObjectURL(f)
                        setBlogImagePreview(url)
                      } else {
                        if (blogImagePreview) URL.revokeObjectURL(blogImagePreview)
                        setBlogImagePreview(null)
                      }
                    }} />
                    {blogImagePreview && (
                      <div className="mt-2 flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={blogImagePreview} alt="blog-preview" className="h-16 w-28 object-cover rounded" />
                        <button type="button" onClick={() => { if (blogImagePreview) URL.revokeObjectURL(blogImagePreview); setBlogImageFile(null); setBlogImagePreview(null) }} className="text-sm text-red-600">Remove</button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <div className="flex gap-2 mb-2">
                      <button type="button" onClick={() => applyWrap('**')} className="px-2 py-1 border rounded">Bold</button>
                      <button type="button" onClick={() => applyWrap('*')} className="px-2 py-1 border rounded">Italic</button>
                      <button type="button" onClick={() => applyWrap('`')} className="px-2 py-1 border rounded">Code</button>
                      <button type="button" onClick={() => applyWrap('[', '](url)')} className="px-2 py-1 border rounded">Link</button>
                      <button type="button" onClick={() => applyLinePrefix('# ')} className="px-2 py-1 border rounded">H1</button>
                      <button type="button" onClick={() => applyLinePrefix('## ')} className="px-2 py-1 border rounded">H2</button>
                      <button type="button" onClick={() => applyLinePrefix('- ')} className="px-2 py-1 border rounded">List</button>
                    </div>
                    <textarea ref={blogContentRef} name="content" placeholder="Write full article content here (supports simple markdown)" className="border p-2 rounded h-40 w-full" />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button type="button" onClick={() => setShowAddBlogModal(false)} className="mr-3 px-4 py-2 rounded border">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white">Create Post</button>
                </div>
              </form>
            </div>
          )}

          {/* Add Dealer Modal */}
          {showAddDealerModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="bg-white rounded-xl w-full max-w-xl">
                <form onSubmit={handleCreateDealer} className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Add New Dealer</h3>
                    <button type="button" onClick={() => setShowAddDealerModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dealer Name *</label>
                      <input 
                        name="name" 
                        required 
                        placeholder="e.g. Auto Palace, Car World" 
                        className="border p-2 rounded w-full" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Owner / Contact Person</label>
                      <input 
                        name="owner" 
                        placeholder="e.g. John Smith" 
                        className="border p-2 rounded w-full" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input 
                          name="phone" 
                          placeholder="e.g. 072 123 4567" 
                          className="border p-2 rounded w-full" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                          name="email" 
                          type="email"
                          placeholder="e.g. dealer@example.com" 
                          className="border p-2 rounded w-full" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
                      <textarea 
                        name="address" 
                        placeholder="Street address, city, postal code" 
                        className="border p-2 rounded w-full h-20" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
                      <textarea 
                        name="notes" 
                        placeholder="Commission details, agreements, special terms, etc." 
                        className="border p-2 rounded w-full h-24" 
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-6 gap-3">
                    <button 
                      type="button" 
                      onClick={() => setShowAddDealerModal(false)} 
                      className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold"
                    >
                      Create Dealer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Content based on active tab */}
          {activeTab === 'cars' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">Car Listings</h2>
                  {selectedDealer && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-gray-600">
                        Filtering by: <span className="font-semibold text-blue-600">{dealers.find(d => d.id === selectedDealer)?.name}</span>
                      </span>
                      <button
                        onClick={() => setSelectedDealer(null)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Clear filter
                      </button>
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleAddCar}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Car
                </button>
              </div>
              {/* Grid of cards (public listings) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {carListings
                  .filter(car => !selectedDealer || (car as any).dealerId === selectedDealer)
                  .map((car) => (
                  <div key={car.id} className="bg-white rounded-2xl shadow-sm p-4">
                    <div className="h-48 w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-4">
                      {car.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={car.image} alt={car.title} className="object-cover w-full h-full" />
                      ) : (
                        <div className="text-4xl">🚗</div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">{car.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{car.location} • {car.year}</p>
                      <p className="text-xl font-bold text-blue-600 mb-3">R{Number(car.price).toLocaleString()}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Droplet className="h-4 w-4 text-gray-500" />
                          <span>{car.fuelType}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="h-4 w-4 text-gray-500" />
                          <span>{car.transmission}</span>
                        </div>
                        {car.color && (
                          <div className="flex items-center gap-1">
                            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: car.color }} />
                            <span>{car.color}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditCar(car)} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">Edit</button>
                          <button onClick={() => handleDeleteCar(car.id)} className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-sm">Delete</button>
                        </div>
                        {car.isFeatured && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Featured</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Car</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Price</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Location</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Views</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carListings.map((car) => (
                      <tr key={car.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium">{car.title}</p>
                            <p className="text-sm text-gray-500">{car.year} • {car.mileage.toLocaleString()} km</p>
                            <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Droplet className="h-4 w-4 text-gray-500" />
                                <span>{car.fuelType}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Zap className="h-4 w-4 text-gray-500" />
                                <span>{car.transmission}</span>
                              </div>
                              {car.color && (
                                <div className="flex items-center gap-1">
                                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: car.color }} />
                                  <span>{car.color}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-bold">R{car.price.toLocaleString()}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-gray-600">{car.location}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(car.status)}`}>
                            {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                          </span>
                          {car.isFeatured && (
                            <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                              Featured
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 text-gray-400 mr-1" />
                            <span>{car.views.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button onClick={() => handleEditCar(car)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteCar(car.id)}
                              className="p-2 hover:bg-red-50 rounded-lg text-red-600"
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
          )}

          {activeTab === 'dealers' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Dealers Management</h2>
                <button 
                  onClick={handleAddDealer}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Dealer
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Dealer Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Owner</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Vehicles</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dealers.map((dealer) => {
                      const vehicleCount = carListings.filter(c => (c as any).dealerId === dealer.id).length
                      return (
                        <tr key={dealer.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="font-semibold text-gray-900">{dealer.name}</div>
                            {dealer.address && <div className="text-xs text-gray-500 mt-1">{dealer.address}</div>}
                          </td>
                          <td className="py-3 px-4 text-gray-600">{dealer.owner || '-'}</td>
                          <td className="py-3 px-4 text-gray-600">{dealer.phone || '-'}</td>
                          <td className="py-3 px-4 text-gray-600">{dealer.email || '-'}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => {
                                setSelectedDealer(dealer.id)
                                setActiveTab('cars')
                              }}
                              className="text-blue-600 hover:underline font-semibold"
                            >
                              {vehicleCount} vehicle{vehicleCount !== 1 ? 's' : ''}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(dealer.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-end space-x-2">
                              <button 
                                onClick={() => handleDeleteDealer(dealer.id)}
                                className="p-2 hover:bg-red-50 rounded text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                    {dealers.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-500">
                          No dealers yet. Click "Add Dealer" to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'blogs' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Blog Posts</h2>
                <button 
                  onClick={handleAddBlog}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Post
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Title</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Category</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Author</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Views</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogPosts.map((blog) => (
                      <tr key={blog.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium">{blog.title}</p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">{blog.excerpt}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {blog.category}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-gray-600">{blog.author}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 text-gray-400 mr-1" />
                            <span>{blog.views.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteBlog(blog.id)}
                              className="p-2 hover:bg-red-50 rounded-lg text-red-600"
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
          )}

          {activeTab === 'leads' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-bold mb-6">Recent Sale Leads</h2>
              <div className="space-y-4">
                {recentLeads.map((lead, index) => (
                  <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-blue-600">
                          {lead.name ? lead.name.charAt(0) : 'L'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-gray-600">{lead.carMake} {lead.carModel}</p>
                        <p className="text-sm text-gray-500">{lead.phone} {lead.email ? `• ${lead.email}` : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor('new')}`}>
                        New
                      </span>
                      <span className="text-sm text-gray-500">{lead.createdAt ? new Date(lead.createdAt).toLocaleString() : ''}</span>
                      <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
                        <Phone className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Site Settings</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                  <input value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Site name" className="border p-2 rounded w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                  <input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Tagline" className="border p-2 rounded w-full" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hero Images (up to 10)</label>
                  <input type="file" accept="image/*" multiple onChange={(e) => {
                    const files = e.target.files
                    if (!files) return
                    const arr = Array.from(files).slice(0, 10)
                    const urls = arr.map(f => URL.createObjectURL(f))
                    // revoke old
                    heroPreviews.forEach(u => URL.revokeObjectURL(u))
                    setHeroFiles(arr)
                    setHeroPreviews(urls)
                  }} className="border p-2 rounded w-full" />
                  {heroPreviews.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-3">
                      {heroPreviews.map((src, idx) => (
                        <div key={idx} className="relative rounded-lg overflow-hidden shadow-sm bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={`hero-preview-${idx}`} className="object-cover w-28 h-20" />
                          <div className="p-1 flex items-center justify-between">
                            <div className="text-xs text-gray-600 truncate max-w-[140px]">{heroFiles[idx]?.name || ''}</div>
                            <button type="button" onClick={() => {
                              const next = heroFiles.slice(); next.splice(idx, 1); setHeroFiles(next)
                              const nextP = heroPreviews.slice(); const rem = nextP.splice(idx,1); rem.forEach(u => URL.revokeObjectURL(u)); setHeroPreviews(nextP)
                            }} className="ml-2 text-sm text-red-600">Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 flex items-center gap-3">
                  <button type="button" onClick={async () => {
                    setSiteMessage(null)
                    setSiteUploading(true)
                    try {
                      const heroBase64 = heroFiles.length > 0 ? await Promise.all(heroFiles.slice(0,10).map(f => toBase64(f))) : undefined
                      const body: any = { }
                      if (siteName) body.siteName = siteName
                      if (tagline) body.tagline = tagline
                      if (heroBase64) body.heroImagesBase64 = heroBase64.filter(Boolean)
                      const res = await fetch('/api/site', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
                      if (res.ok) {
                        const data = await res.json()
                        setSiteMessage('Saved')
                        if (data.siteName) setSiteName(data.siteName)
                        if (data.tagline) setTagline(data.tagline)
                        // revoke previous previews to avoid leaks
                        heroPreviews.forEach(u => URL.revokeObjectURL(u)); setHeroPreviews([]); setHeroFiles([])
                      } else {
                        setSiteMessage('Failed to save')
                      }
                    } catch (e) {
                      console.error(e)
                      setSiteMessage('Failed to save')
                    }
                    setSiteUploading(false)
                  }} className="px-4 py-2 rounded bg-blue-600 text-white shadow hover:bg-blue-700 transition-colors">{siteUploading ? 'Saving...' : 'Save Settings'}</button>
                  <span className="text-sm text-gray-500">{siteMessage}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <>
              {/* Recent Activity */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {[
                    { action: 'New car listing added', user: 'Admin', time: '2 hours ago', type: 'car' },
                    { action: 'Blog post published', user: 'Admin', time: '4 hours ago', type: 'blog' },
                    { action: 'New lead received', user: 'John Smith', time: '6 hours ago', type: 'lead' },
                    { action: 'Car marked as sold', user: 'Admin', time: '1 day ago', type: 'car' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          activity.type === 'car' ? 'bg-blue-100 text-blue-600' : 
                          activity.type === 'blog' ? 'bg-green-100 text-green-600' : 
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {activity.type === 'car' ? <Car className="h-5 w-5" /> : 
                           activity.type === 'blog' ? <FileText className="h-5 w-5" /> : 
                           <Users className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-600">By {activity.user}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}