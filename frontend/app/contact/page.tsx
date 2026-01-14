"use client"

import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'
import type { Metadata } from 'next'

// Note: metadata export doesn't work with 'use client' - consider moving to separate file or using next/head

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('✅ Message sent successfully! We\'ll get back to you soon.')
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        alert('❌ Failed to send message. Please try again or call us directly.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to send message. Please try again or call us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-blue-100">
              We're here to help. Get in touch with our team today.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                      <p className="text-gray-600">072 324 8098</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-600">info@idealcar.co.za</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                      <p className="text-gray-600">Wonderboom, Pretoria, 0182</p>
                    </div>
                  </div>
                  
                </div>
              </div>
              
              <div className="bg-blue-600 text-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold mb-4">Need Immediate Assistance?</h3>
                <p className="mb-4">Contact us directly for urgent inquiries.</p>
                <a 
                  href="tel:+27723248098" 
                  className="inline-flex items-center bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </a>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8 h-full">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Subject *</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="purchase">Purchase a vehicle</option>
                        <option value="inspection">Book vehicle inspection</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your message here..."
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors inline-flex items-center justify-center"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          </div>
        </div>
      </section>
    </main>
  )
}
