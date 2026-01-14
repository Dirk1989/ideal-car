// app/sell-car/page.tsx - LEAD FORM VERSION
"use client"

import { useState } from "react"
import { Phone, Mail, Clock, DollarSign, CheckCircle, Car, MapPin, Calendar, Fuel, Settings } from "lucide-react"
import type { Metadata } from 'next'

// Note: metadata export doesn't work with 'use client' - consider moving to separate file

export default function SellCarPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    carMake: "",
    carModel: "",
    carYear: "",
    carMileage: "",
    carLocation: "johannesburg",
    preferredContact: "phone",
    additionalInfo: "",
    urgency: "within_week"
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const gautengAreas = [
    { value: "johannesburg", label: "Johannesburg" },
    { value: "pretoria", label: "Pretoria" },
    { value: "sandton", label: "Sandton" },
    { value: "centurion", label: "Centurion" },
    { value: "midrand", label: "Midrand" },
    { value: "randburg", label: "Randburg" },
    { value: "roodepoort", label: "Roodepoort" },
    { value: "fourways", label: "Fourways" },
    { value: "benoni", label: "Benoni" },
    { value: "alberton", label: "Alberton" },
    { value: "other", label: "Other Gauteng Area" },
  ]

  const benefits = [
    { icon: <DollarSign className="h-6 w-6" />, title: "Cash Offer", desc: "Get a fair cash offer for your car" },
    { icon: <Clock className="h-6 w-6" />, title: "Fast Process", desc: "Sell your car in as little as 24 hours" },
    { icon: <CheckCircle className="h-6 w-6" />, title: "No Hassle", desc: "We handle all paperwork and logistics" },
    { icon: <Car className="h-6 w-6" />, title: "Any Condition", desc: "We buy cars in any condition" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setIsSubmitted(true)
        setIsSubmitting(false)
        setFormData({
          name: "",
          phone: "",
          email: "",
          carMake: "",
          carModel: "",
          carYear: "",
          carMileage: "",
          carLocation: "johannesburg",
          preferredContact: "phone",
          additionalInfo: "",
          urgency: "within_week"
        })
      } else {
        throw new Error('Failed to submit lead')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setIsSubmitting(false)
      alert('There was an error submitting your request. Please try again.')
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
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Sell Your Car Fast in Gauteng
            </h1>
            <p className="text-xl md:text-2xl text-blue-100">
              Get a free, no-obligation cash offer for your car. We'll contact you within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">

          {isSubmitted ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
              <p className="text-xl text-gray-700 mb-6">
                Your car sale request has been received successfully.
              </p>
              <p className="text-gray-600 mb-8">
                We will contact you within 24 hours at <strong>{formData.phone || formData.email}</strong> 
                to discuss your car and arrange a free valuation.
              </p>
              <div className="bg-blue-50 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-gray-900 mb-3">What happens next?</h3>
                <ol className="text-left text-gray-600 space-y-3">
                  <li className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm font-bold flex-shrink-0">1</span>
                    <span>Our team reviews your car details</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm font-bold flex-shrink-0">2</span>
                    <span>We call you to discuss and arrange inspection</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm font-bold flex-shrink-0">3</span>
                    <span>Get a fair cash offer for your car</span>
                  </li>
                </ol>
              </div>
              <button
                onClick={() => setIsSubmitted(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Submit Another Car
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Benefits Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
                  <h2 className="text-2xl font-bold mb-6">Why Sell to Us</h2>
                  <div className="space-y-6">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                          {benefit.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{benefit.title}</h3>
                          <p className="text-gray-600 text-sm">{benefit.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4">Our Process</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Submit your car details (2 mins)
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        We contact you within 24 hours
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Free inspection & valuation
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Get paid, we handle paperwork
                      </li>
                    </ul>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4">Contact Info</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-sm text-gray-600">072 324 8098</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-sm text-gray-600">info@idealcar.co.za</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-4">
                        <p>Service available in:</p>
                        <p>Johannesburg, Pretoria & Gauteng areas</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">Get Your Free Cash Offer</h2>
                  <p className="text-gray-600 mb-8">
                    Fill in your car details below. Our team will contact you with a cash offer within 24 hours.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Contact Information */}
                    <div>
                      <h3 className="text-xl font-bold mb-6 pb-3 border-b border-gray-200">Your Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-700 mb-2">Full Name *</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="John Smith"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2">Phone Number *</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="071 234 5678"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2">Email Address</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="john@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2">Preferred Contact Method</label>
                          <select
                            name="preferredContact"
                            value={formData.preferredContact}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="phone">Phone Call</option>
                            <option value="whatsapp">WhatsApp</option>
                            <option value="email">Email</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Car Details */}
                    <div>
                      <h3 className="text-xl font-bold mb-6 pb-3 border-b border-gray-200">Car Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-gray-700 mb-2 flex items-center">
                            <Car className="h-4 w-4 mr-2" />
                            Car Make *
                          </label>
                          <input
                            type="text"
                            name="carMake"
                            value={formData.carMake}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Toyota, BMW, Mercedes..."
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2">Car Model *</label>
                          <input
                            type="text"
                            name="carModel"
                            value={formData.carModel}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Corolla, X5, C-Class..."
                            required
                          />
                        </div>
                        <div>
                          <label className="text-gray-700 mb-2 flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Year *
                          </label>
                          <input
                            type="number"
                            name="carYear"
                            value={formData.carYear}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="2020"
                            min="1990"
                            max="2024"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-gray-700 mb-2 flex items-center">
                            <Settings className="h-4 w-4 mr-2" />
                            Mileage (km) *
                          </label>
                          <input
                            type="number"
                            name="carMileage"
                            value={formData.carMileage}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="50000"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-gray-700 mb-2 flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            Location *
                          </label>
                          <select
                            name="carLocation"
                            value={formData.carLocation}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            {gautengAreas.map((area) => (
                              <option key={area.value} value={area.value}>
                                {area.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-gray-700 mb-2 flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            How soon to sell?
                          </label>
                          <select
                            name="urgency"
                            value={formData.urgency}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="today">Today</option>
                            <option value="within_week">Within a week</option>
                            <option value="no_rush">No rush, just checking</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div>
                      <h3 className="text-xl font-bold mb-4">Additional Information</h3>
                      <div>
                        <label className="block text-gray-700 mb-2">Car Condition & Features</label>
                        <textarea
                          name="additionalInfo"
                          value={formData.additionalInfo}
                          onChange={handleChange}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Tell us about your car's condition, any accidents, service history, special features, etc..."
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          The more details you provide, the more accurate our offer will be.
                        </p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold py-4 px-6 rounded-lg transition-colors inline-flex items-center justify-center`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <DollarSign className="mr-2 h-5 w-5" />
                            Get Free Cash Offer
                          </>
                        )}
                      </button>
                      <p className="text-center text-sm text-gray-500 mt-4">
                        By submitting, you agree to be contacted about your car sale. No obligation.
                      </p>
                    </div>
                  </form>

                  {/* Trust Badges */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 mb-1">24h</div>
                        <div className="text-sm text-gray-600">Response Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 mb-1">100%</div>
                        <div className="text-sm text-gray-600">Free Valuation</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 mb-1">5,000+</div>
                        <div className="text-sm text-gray-600">Cars Bought</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 mb-1">R100M+</div>
                        <div className="text-sm text-gray-600">Paid to Sellers</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          </div>
        </div>
      </section>
    </main>
  )
}