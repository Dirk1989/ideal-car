// components/Footer.tsx - ADD SEO TEXT AT BOTTOM
import { Car, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto w-full max-w-full overflow-x-hidden">
      <div className="container-custom w-full">
        <div className="section-padding">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 w-full">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Car className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">IdealCar</span>
              </div>
              <p className="text-gray-400">
                South Africa's premier car advertising platform connecting buyers and sellers.
              </p>
              <div className="flex space-x-4">
                <a href="https://facebook.com/idealdealsza" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="https://twitter.com/idealcarsa" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-400 transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="https://instagram.com/idealcarsa" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-pink-600 transition-colors">
                  <Instagram size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="heading-3 mb-4">Quick Links</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/vehicles" className="hover:text-white transition-colors">Browse Cars</Link></li>
                <li><Link href="/sell-car" className="hover:text-white transition-colors">Sell Your Car</Link></li>
                <li><Link href="/other-services" className="hover:text-white transition-colors">Inspection Services</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Our Blog</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="heading-3 mb-4">Legal</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/admin/login" className="text-blue-400 hover:text-blue-300 transition-colors">Admin Login</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="heading-3 mb-4">Contact Us</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-3">
                  <Phone size={20} className="text-blue-400" />
                  <a href="tel:+27723248098" className="hover:text-white transition-colors">072 324 8098</a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail size={20} className="text-blue-400" />
                  <a href="mailto:info@idealcar.co.za" className="hover:text-white transition-colors">info@idealcar.co.za</a>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin size={20} className="text-blue-400" />
                  <span>Wonderboom, Pretoria, 0182</span>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="heading-3 mb-4">Stay Updated</h3>
              <p className="text-gray-400 mb-4">Get the latest car deals and news</p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="btn-primary w-full"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* SEO Text Section */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="grid md:grid-cols-2 gap-8 text-sm text-gray-400">
              <div>
                <h4 className="font-semibold text-white mb-3">Cars for Sale in Gauteng</h4>
                <p>
                  Find the best deals on used cars in Johannesburg, Pretoria, Sandton, Centurion, and all Gauteng areas. 
                  Browse thousands of verified listings from private sellers and trusted dealers. 
                  Whether you're looking for sedans, SUVs, bakkies, or luxury vehicles, IdealCar connects you with sellers across South Africa.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Professional Vehicle Inspection Services</h4>
                <p>
                  Get peace of mind with our comprehensive vehicle inspection services. 
                  Our experienced inspectors provide detailed reports on paint, bodywork, mechanical systems, and more. 
                  Perfect for buyers wanting to verify a vehicle's condition before purchase. Available across Gauteng with fast turnaround times.
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} IdealCar - A division of IdealBiz Pty Ltd. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer