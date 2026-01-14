// components/Header.tsx - Enhanced Modern Design
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react'
import SiteBrand from './SiteBrand'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Track scroll for header effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Browse Cars', href: '/vehicles' },
    { label: 'Sell Your Car', href: '/sell-car' },
    { label: 'Other Services', href: '/other-services' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <>
      {/* Top Bar - Contact Info */}
      <div className="hidden lg:block bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="container-custom">
          <div className="flex items-center justify-start py-2 text-sm">
            <div className="flex items-center space-x-6">
              <a href="tel:+27723248098" className="flex items-center space-x-2 hover:text-blue-200 transition-colors">
                <Phone className="h-4 w-4" />
                <span>072 324 8098</span>
              </a>
              <a href="mailto:info@idealcar.co.za" className="flex items-center space-x-2 hover:text-blue-200 transition-colors">
                <Mail className="h-4 w-4" />
                <span>info@idealcar.co.za</span>
              </a>
              <div className="flex items-center space-x-2 text-blue-200">
                <MapPin className="h-4 w-4" />
                <span>Wonderboom, Pretoria</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-lg' 
            : 'bg-white/95 backdrop-blur-sm shadow-sm'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <SiteBrand />
            </div>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center justify-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-200 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-100 animate-fadeIn">
              {/* Mobile Contact Info */}
              <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg space-y-2">
                <a href="tel:+27723248098" className="flex items-center space-x-2 text-blue-900 hover:text-blue-700">
                  <Phone className="h-4 w-4" />
                  <span className="font-medium">072 324 8098</span>
                </a>
                <a href="mailto:info@idealcar.co.za" className="flex items-center space-x-2 text-blue-900 hover:text-blue-700">
                  <Mail className="h-4 w-4" />
                  <span>info@idealcar.co.za</span>
                </a>
              </div>

              {/* Mobile Nav Links */}
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="py-3 px-4 rounded-lg font-medium transition-all hover:bg-blue-50 hover:text-blue-600 text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  )
}

export default Header